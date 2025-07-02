
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ResumeData } from '@/hooks/useResumeData';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { useGPTEnhancement } from '@/hooks/useGPTEnhancement';

interface ExperienceFormProps {
  data: ResumeData;
  onUpdate: (section: keyof ResumeData, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  data,
  onUpdate,
}) => {
  const { enhanceText, isLoading } = useGPTEnhancement();
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };

    onUpdate('experience', [...data.experience, newExperience]);
  };

  const updateExperience = (id: string, field: string, value: any) => {
    const updated = data.experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate('experience', updated);
  };

  const removeExperience = (id: string) => {
    const filtered = data.experience.filter(exp => exp.id !== id);
    onUpdate('experience', filtered);
  };

  const enhanceDescription = async (id: string, description: string) => {
    if (!description) return;
    
    setEnhancingId(id);
    const enhanced = await enhanceText(
      description,
      'job description with quantifiable achievements'
    );
    
    if (enhanced) {
      updateExperience(id, 'description', enhanced);
    }
    setEnhancingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={addExperience} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {data.experience.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50 border-dashed">
          <p className="text-slate-500 mb-4">No work experience added yet</p>
          <Button onClick={addExperience} variant="outline">
            Add Your First Job
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <Card key={exp.id} className="p-6 bg-white shadow-sm border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-slate-800">Experience Entry</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder="Job Title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onCheckedChange={(checked) => {
                        updateExperience(exp.id, 'current', checked);
                        if (checked) {
                          updateExperience(exp.id, 'endDate', '');
                        }
                      }}
                    />
                    <Label htmlFor={`current-${exp.id}`} className="text-sm">
                      I currently work here
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Job Description & Achievements</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => enhanceDescription(exp.id, exp.description)}
                    disabled={!exp.description || enhancingId === exp.id}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {enhancingId === exp.id ? 'Enhancing...' : 'Enhance with AI'}
                  </Button>
                </div>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities, achievements, and impact in this role..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
