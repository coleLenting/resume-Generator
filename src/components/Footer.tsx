import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">ElevateCV</h3>
            <p className="text-slate-300 text-sm">
              Professional resume builder with AI-powered content enhancement
            </p>
          </div>
          
          <div className="border-t border-slate-700 pt-4">
            <p className="text-slate-400 text-sm">
              © 2025 ElevateCV - All rights reserved. | Cole Lenting 2025
            </p>
            <div className="mt-2 space-x-4 text-xs text-slate-500">
              <span>Terms of Use</span>
              <span>•</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};