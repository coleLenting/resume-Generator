
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ResumeData } from '@/hooks/useResumeData';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useGPTEnhancement } from '@/hooks/useGPTEnhancement';

interface PersonalInfoFormProps {
  data: ResumeData;
  onUpdate: (section: keyof ResumeData, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onUpdate,
}) => {
  const { enhanceText, isLoading } = useGPTEnhancement();

  const handleInputChange = (field: string, value: string) => {
    onUpdate('personalInfo', {
      ...data.personalInfo,
      [field]: value,
    });
  };

  const handleEnhanceSummary = async () => {
    if (!data.personalInfo.summary) return;
    
    const enhanced = await enhanceText(
      data.personalInfo.summary,
      'executive summary'
    );
    
    if (enhanced) {
      handleInputChange('summary', enhanced);
    }
  };

  const isRequired = (field: string) => {
    return ['fullName', 'email'].includes(field);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-slate-600 mt-0.5" />
          <div>
            <p className="text-sm text-slate-700 font-medium">Executive Profile Requirements</p>
            <p className="text-xs text-slate-600 mt-1">
              Your name and email are essential for professional communication. 
              Other fields enhance your profile but remain optional.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-slate-700 font-medium">
            Full Name {isRequired('fullName') && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="fullName"
            value={data.personalInfo.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="John A. Smith"
            className="transition-all duration-200 focus:ring-2 focus:ring-slate-500 border-slate-300"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">
            Professional Email {isRequired('email') && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="email"
            type="email"
            value={data.personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john.smith@company.com"
            className="transition-all duration-200 focus:ring-2 focus:ring-slate-500 border-slate-300"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
          <Input
            id="phone"
            value={data.personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="transition-all duration-200 focus:ring-2 focus:ring-slate-500 border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-slate-700 font-medium">Location</Label>
          <Input
            id="location"
            value={data.personalInfo.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="New York, NY"
            className="transition-all duration-200 focus:ring-2 focus:ring-slate-500 border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedIn" className="text-slate-700 font-medium">LinkedIn Profile</Label>
          <Input
            id="linkedIn"
            value={data.personalInfo.linkedIn}
            onChange={(e) => handleInputChange('linkedIn', e.target.value)}
            placeholder="linkedin.com/in/johnsmith"
            className="transition-all duration-200 focus:ring-2 focus:ring-slate-500 border-slate-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio" className="text-slate-700 font-medium">Portfolio/Website</Label>
          <Input
            id="portfolio"
            value={data.personalInfo.portfolio}
            onChange={(e) => handleInputChange('portfolio', e.target.value)}
            placeholder="johnsmith.com"
            className="transition-all duration-200 focus:ring-2 focus:ring-slate-500 border-slate-300"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary" className="text-slate-700 font-medium">Executive Summary</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnhanceSummary}
            disabled={!data.personalInfo.summary || isLoading}
            className="flex items-center gap-2 border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            <Sparkles className="h-4 w-4" />
            {isLoading ? 'Enhancing...' : 'AI Enhancement'}
          </Button>
        </div>
        <Textarea
          id="summary"
          value={data.personalInfo.summary}
          onChange={(e) => handleInputChange('summary', e.target.value)}
          placeholder="Strategic executive with proven track record in driving organizational growth and leading high-performance teams..."
          rows={4}
          className="transition-all duration-200 focus:ring-2 focus:ring-slate-500 resize-none border-slate-300"
        />
        <p className="text-xs text-slate-500">
          Craft a compelling 2-3 sentence summary highlighting your leadership achievements and value proposition.
        </p>
      </div>
    </div>
  );
};
