
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { ResumePreview } from './ResumePreview';
import { useResumeData } from '@/hooks/useResumeData';
import { ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

const steps = [
  { id: 1, title: 'Executive Profile', component: PersonalInfoForm },
  { id: 2, title: 'Professional Experience', component: ExperienceForm },
  { id: 3, title: 'Education & Credentials', component: EducationForm },
  { id: 4, title: 'Core Competencies', component: SkillsForm },
  { id: 5, title: 'Resume Preview', component: ResumePreview },
];

export const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { resumeData, updateResumeData } = useResumeData();

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentComponent = currentStepData?.component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  // Check if required fields are filled for the current step
  const canProceed = () => {
    if (currentStep === 1) {
      return resumeData.personalInfo.fullName && resumeData.personalInfo.email;
    }
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-8 p-6 bg-white/90 backdrop-blur-sm border-slate-300 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-slate-600" />
            {currentStepData?.title}
          </h2>
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Step {currentStep} of {steps.length}
          </div>
        </div>
        <Progress value={progress} className="mb-6 h-2" />
        
        <div className="min-h-[400px]">
          {CurrentComponent && (
            <CurrentComponent 
              data={resumeData} 
              onUpdate={updateResumeData}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
        </div>

        {currentStep < steps.length && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800"
            >
              {currentStep === 4 ? 'Preview Resume' : 'Continue'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Required fields reminder */}
        {currentStep === 1 && !canProceed() && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Essential Information Required:</strong> Please provide your full name and email address to continue. 
              These are fundamental details that every professional resume must include.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
