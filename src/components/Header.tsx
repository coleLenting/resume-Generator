import React from 'react';
import { Briefcase } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-700 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">ElevateCV</h1>
              <p className="text-xs text-slate-600">Professional Resume Builder</p>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Powered by AI Enhancement
          </div>
        </div>
      </div>
    </header>
  );
};