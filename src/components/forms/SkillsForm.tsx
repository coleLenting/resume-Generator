
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResumeData } from '@/hooks/useResumeData';
import { Plus, X, Lightbulb } from 'lucide-react';

interface SkillsFormProps {
  data: ResumeData;
  onUpdate: (section: keyof ResumeData, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onUpdate }) => {
  const [newSkill, setNewSkill] = React.useState({
    technical: '',
    soft: '',
    languages: '',
    certifications: '',
  });

  const addSkill = (category: keyof typeof newSkill) => {
    const skill = newSkill[category].trim();
    if (!skill) return;

    const currentSkills = data.skills[category];
    if (!currentSkills.includes(skill)) {
      onUpdate('skills', {
        ...data.skills,
        [category]: [...currentSkills, skill],
      });
    }

    setNewSkill(prev => ({ ...prev, [category]: '' }));
  };

  const removeSkill = (category: keyof typeof data.skills, skillToRemove: string) => {
    onUpdate('skills', {
      ...data.skills,
      [category]: data.skills[category].filter(skill => skill !== skillToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, category: keyof typeof newSkill) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(category);
    }
  };

  const handleInputChange = (category: keyof typeof newSkill, value: string) => {
    setNewSkill(prev => ({ ...prev, [category]: value }));
  };

  const SkillSection = ({ 
    title, 
    category, 
    placeholder,
    description,
    suggestions = []
  }: { 
    title: string; 
    category: keyof typeof data.skills; 
    placeholder: string;
    description: string;
    suggestions?: string[];
  }) => (
    <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-slate-800 flex items-center gap-2">
            {title}
            <Lightbulb className="h-4 w-4 text-amber-500" />
          </Label>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newSkill[category]}
            onChange={(e) => handleInputChange(category, e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => handleKeyDown(e, category)}
            className="flex-1 bg-slate-50 border-slate-300 focus:border-slate-500 focus:bg-white transition-colors"
          />
          <Button
            type="button"
            size="sm"
            onClick={() => addSkill(category)}
            disabled={!newSkill[category].trim()}
            className="bg-slate-700 hover:bg-slate-800 text-white px-4"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-slate-500 mr-2">Suggestions:</span>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleInputChange(category, suggestion)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 bg-slate-50 rounded-lg border">
          {data.skills[category].length === 0 ? (
            <span className="text-sm text-slate-400 italic">No {title.toLowerCase()} added yet</span>
          ) : (
            data.skills[category].map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(category, skill)}
                  className="ml-1 hover:text-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Professional Skills & Qualifications</h3>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Showcase your expertise and competencies. Add skills that align with your career goals and target positions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillSection
          title="Technical Skills"
          category="technical"
          placeholder="e.g., JavaScript, Python, React..."
          description="Programming languages, software, and technical tools"
          suggestions={['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS']}
        />
        
        <SkillSection
          title="Leadership & Soft Skills"
          category="soft"
          placeholder="e.g., Team Leadership, Strategic Planning..."
          description="Management and interpersonal competencies"
          suggestions={['Team Leadership', 'Strategic Planning', 'Communication', 'Problem Solving']}
        />
        
        <SkillSection
          title="Languages"
          category="languages"
          placeholder="e.g., English (Native), Spanish (Fluent)..."
          description="Language proficiency levels"
          suggestions={['English (Native)', 'Spanish (Fluent)', 'French (Conversational)']}
        />
        
        <SkillSection
          title="Certifications"
          category="certifications"
          placeholder="e.g., PMP, AWS Certified, CPA..."
          description="Professional certifications and licenses"
          suggestions={['PMP', 'AWS Certified', 'CPA', 'Scrum Master', 'Google Analytics']}
        />
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Professional Tips</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Use industry-standard terminology and keywords</li>
              <li>• Include both hard and soft skills relevant to your field</li>
              <li>• Add skill levels for languages (e.g., "Fluent", "Conversational")</li>
              <li>• Include recent certifications and active licenses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
