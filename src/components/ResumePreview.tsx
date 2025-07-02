import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResumeData } from '@/hooks/useResumeData';
import { Download, FileText, Eye, Palette, Briefcase, User } from 'lucide-react';

import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumePreviewProps {
  data: ResumeData;
  onUpdate: (section: keyof ResumeData, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

type TemplateType = 'modern' | 'classic' | 'creative' | 'minimal';

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const resumeRef = useRef<HTMLDivElement>(null); // <-- Add this line

  const handleDownloadPDF = async () => {
  if (!resumeRef.current) return;

  try {
    // Step 1: Convert the resume to an image
    const canvas = await html2canvas(resumeRef.current, {
      scale: 2, // Higher quality
      logging: false, // Disable console logs
      useCORS: true, // Allow cross-origin images (if any)
    });

    // Step 2: Create a PDF
    const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
    const imgData = canvas.toDataURL('image/png'); // Image data URL

    // Calculate dimensions to fit PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Step 3: Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Step 4: Generate a filename
    const name = data.personalInfo.fullName?.replace(/\s+/g, '_') || 'resume';
    pdf.save(`${name}_${selectedTemplate}_resume.pdf`); // Auto-downloads

  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const ModernTemplate = () => (
    <Card className="p-8 bg-white shadow-lg max-w-4xl mx-auto border-slate-200">
      {/* Modern Template Header */}
      <div className="text-center mb-8 border-b-2 border-slate-700 pb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-slate-600 text-sm">
          {data.personalInfo.email && <span className="bg-slate-100 px-3 py-1 rounded-full">{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="bg-slate-100 px-3 py-1 rounded-full">{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span className="bg-slate-100 px-3 py-1 rounded-full">{data.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-slate-600 text-sm mt-3">
          {data.personalInfo.linkedIn && <span className="text-slate-700 font-medium">{data.personalInfo.linkedIn}</span>}
          {data.personalInfo.portfolio && <span className="text-slate-700 font-medium">{data.personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Modern Template Sections */}
      {data.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide border-l-4 border-slate-700 pl-4">
            Executive Summary
          </h2>
          <p className="text-slate-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide border-l-4 border-slate-700 pl-4">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-slate-200 pl-6 ml-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{exp.position}</h3>
                    <h4 className="text-slate-700 font-semibold">{exp.company}</h4>
                  </div>
                  <div className="text-slate-600 text-sm font-medium bg-slate-50 px-3 py-1 rounded">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide border-l-4 border-slate-700 pl-4">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-slate-200 pl-6 ml-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                    <h4 className="text-slate-700 font-semibold">{edu.institution}</h4>
                    {edu.field && <p className="text-slate-600">{edu.field}</p>}
                  </div>
                  <div className="text-slate-600 text-sm">
                    {formatDate(edu.graduationDate)}
                    {edu.gpa && <div className="font-medium">GPA: {edu.gpa}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || 
        data.skills.languages.length > 0 || data.skills.certifications.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide border-l-4 border-slate-700 pl-4">
            Core Competencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.skills.technical.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Technical Expertise</h3>
                <p className="text-slate-700">{data.skills.technical.join(' • ')}</p>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Leadership Skills</h3>
                <p className="text-slate-700">{data.skills.soft.join(' • ')}</p>
              </div>
            )}
            {data.skills.languages.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Languages</h3>
                <p className="text-slate-700">{data.skills.languages.join(' • ')}</p>
              </div>
            )}
            {data.skills.certifications.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Certifications</h3>
                <p className="text-slate-700">{data.skills.certifications.join(' • ')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  const ClassicTemplate = () => (
    <Card className="p-8 bg-white shadow-lg max-w-4xl mx-auto border-slate-200">
      {/* Classic Template Header */}
      <div className="mb-8 pb-4 border-b border-slate-300">
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-slate-600 text-sm space-y-1">
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
          {data.personalInfo.linkedIn && <div>{data.personalInfo.linkedIn}</div>}
          {data.personalInfo.portfolio && <div>{data.personalInfo.portfolio}</div>}
        </div>
      </div>

      {/* Classic Template Sections */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-serif font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-slate-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-serif font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-slate-900">{exp.position}</h3>
                    <h4 className="text-slate-700 italic">{exp.company}</h4>
                  </div>
                  <div className="text-slate-600 text-sm">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap ml-4">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-serif font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">
            EDUCATION
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                    <h4 className="text-slate-700 italic">{edu.institution}</h4>
                    {edu.field && <p className="text-slate-600">{edu.field}</p>}
                  </div>
                  <div className="text-slate-600 text-sm">
                    {formatDate(edu.graduationDate)}
                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || 
        data.skills.languages.length > 0 || data.skills.certifications.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-serif font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">
            SKILLS & QUALIFICATIONS
          </h2>
          <div className="space-y-3">
            {data.skills.technical.length > 0 && (
              <div>
                <span className="font-semibold text-slate-800">Technical Skills: </span>
                <span className="text-slate-700">{data.skills.technical.join(', ')}</span>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div>
                <span className="font-semibold text-slate-800">Core Competencies: </span>
                <span className="text-slate-700">{data.skills.soft.join(', ')}</span>
              </div>
            )}
            {data.skills.languages.length > 0 && (
              <div>
                <span className="font-semibold text-slate-800">Languages: </span>
                <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
              </div>
            )}
            {data.skills.certifications.length > 0 && (
              <div>
                <span className="font-semibold text-slate-800">Certifications: </span>
                <span className="text-slate-700">{data.skills.certifications.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  const CreativeTemplate = () => (
    <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg max-w-4xl mx-auto border-blue-200">
      {/* Creative Header with Color Accent */}
      <div className="text-center mb-8 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg"></div>
        <div className="pt-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="flex flex-wrap justify-center gap-3 text-slate-700 text-sm">
            {data.personalInfo.email && (
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur px-3 py-2 rounded-full border border-blue-200">
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur px-3 py-2 rounded-full border border-blue-200">
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur px-3 py-2 rounded-full border border-blue-200">
                <span>{data.personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Creative Sections with Icons */}
      {data.personalInfo.summary && (
        <div className="mb-8 bg-white/70 backdrop-blur rounded-lg p-6 border border-blue-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-8 bg-white/70 backdrop-blur rounded-lg p-6 border border-blue-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-blue-300">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{exp.position}</h3>
                    <h4 className="text-blue-700 font-semibold">{exp.company}</h4>
                  </div>
                  <div className="text-slate-600 text-sm bg-blue-100 px-3 py-1 rounded-full">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills in creative card layout */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || 
        data.skills.languages.length > 0 || data.skills.certifications.length > 0) && (
        <div className="mb-8 bg-white/70 backdrop-blur rounded-lg p-6 border border-blue-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.technical.length > 0 && (
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.technical.map((skill, index) => (
                    <span key={index} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-100 to-indigo-50 p-4 rounded-lg">
                <h3 className="font-bold text-indigo-800 mb-2">Leadership Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.soft.map((skill, index) => (
                    <span key={index} className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  const MinimalTemplate = () => (
    <Card className="p-8 bg-white shadow-lg max-w-4xl mx-auto border-gray-200">
      {/* Minimal Clean Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-light text-gray-900 mb-2 tracking-wide">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="w-20 h-0.5 bg-gray-900 mb-4"></div>
        <div className="text-gray-600 text-sm space-x-4">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>•</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>•</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>

      {/* Minimal Sections */}
      {data.personalInfo.summary && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
            Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm">{data.personalInfo.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
            Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-gray-900">{exp.position}</h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <h4 className="text-gray-700 text-sm mb-2">{exp.company}</h4>
                {exp.description && (
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Minimal Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
            Skills
          </h2>
          <div className="space-y-2">
            {data.skills.technical.length > 0 && (
              <div>
                <span className="text-gray-600 text-sm">{data.skills.technical.join(', ')}</span>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div>
                <span className="text-gray-600 text-sm">{data.skills.soft.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate />;
      case 'classic':
        return <ClassicTemplate />;
      case 'creative':
        return <CreativeTemplate />;
      case 'minimal':
        return <MinimalTemplate />;
      default:
        return <ModernTemplate />;
    }
  };

  const isEmpty = !data.personalInfo.fullName && data.experience.length === 0 && data.education.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Resume Preview</h3>
          <p className="text-slate-600 mt-1">Choose your preferred template style and download your professional resume</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTemplate} onValueChange={(value: TemplateType) => setSelectedTemplate(value)}>
            <SelectTrigger className="w-48 bg-white border-slate-300">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Modern Executive
                </div>
              </SelectItem>
              <SelectItem value="classic">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Classic Professional
                </div>
              </SelectItem>
              <SelectItem value="creative">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Creative Designer
                </div>
              </SelectItem>
              <SelectItem value="minimal">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Minimal Clean
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleDownloadPDF} 
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800"
            disabled={isEmpty}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div ref={resumeRef}>
        {renderTemplate()}
      </div>

      {isEmpty && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Your professional resume preview will appear here</p>
          <p className="text-sm text-slate-400 mt-2">Complete the previous steps to see your resume come to life</p>
        </div>
      )}
    </div>
  );
};
