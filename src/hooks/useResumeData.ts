
import { useState } from 'react';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    portfolio: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  };
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
    certifications: [],
  },
};

export const useResumeData = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  return {
    resumeData,
    updateResumeData,
    setResumeData,
  };
};
