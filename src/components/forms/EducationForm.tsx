
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ResumeData } from '@/hooks/useResumeData';
import { Plus, Trash2 } from 'lucide-react';

interface EducationFormProps {
  data: ResumeData;
  onUpdate: (section: keyof ResumeData, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  data,
  onUpdate,
}) => {
  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
    };

    onUpdate('education', [...data.education, newEducation]);
  };

  const updateEducation = (id: string, field: string, value: string) => {
    const updated = data.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate('education', updated);
  };

  const removeEducation = (id: string) => {
    const filtered = data.education.filter(edu => edu.id !== id);
    onUpdate('education', filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={addEducation} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {data.education.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50 border-dashed">
          <p className="text-slate-500 mb-4">No education added yet</p>
          <Button onClick={addEducation} variant="outline">
            Add Your Education
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.education.map((edu) => (
            <Card key={edu.id} className="p-6 bg-white shadow-sm border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-slate-800">Education Entry</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="University Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor's, Master's, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    placeholder="Computer Science, Business, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Graduation Date</Label>
                  <Input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
