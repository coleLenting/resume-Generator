import { useState } from 'react';

export const useGPTEnhancement = () => {
  const [isLoading, setIsLoading] = useState(false);

  const enhanceText = async (text: string, type: string): Promise<string | null> => {
    if (!text.trim()) return null;
    
    setIsLoading(true);
    
    try {
      const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
      
      if (!API_KEY) {
        console.warn('Google AI API key not found in environment variables');
        throw new Error('API key not configured');
      }

      // Enhanced prompts for different content types
      const prompts = {
        'executive summary': `Transform this into a compelling 2-3 sentence summary highlighting leadership, strategic impact, and quantifiable results, keep it personal by talking like me: "${text}"`,
        'job description with quantifiable achievements': `Condense this into 2-3 bullet points emphasizing metrics, action verbs, and impact, make sure to get rid of fluff only the needed output, no examples / markup format / different choices: "${text}"`,
        'skills refinement': `Refine this skills list for an executive role, using industry-standard terms: "${text}"`,
        'formatting suggestions': `Optimize this section for a professional, executive-level resume: "${text}"`
      };

      const prompt = prompts[type as keyof typeof prompts] || `Enhance this ${type} for a professional resume, only the output, no addition: "${text}"`;

      // Using Google's Gemini API (free tier)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error enhancing text:', error);
      
      // Fallback enhancement for offline/error scenarios
      const fallbackEnhancements = {
        'executive summary': `Strategic ${text} with proven track record of driving organizational growth and leading high-performance teams to exceed targets.`,
        'job description with quantifiable achievements': `• ${text}\n• Achieved measurable results through strategic initiatives\n• Led cross-functional teams to deliver exceptional outcomes`,
        'skills refinement': text.split(',').map(skill => skill.trim()).filter(Boolean).join(' • '),
        'formatting suggestions': `Enhanced: ${text}`
      };
      
      return fallbackEnhancements[type as keyof typeof fallbackEnhancements] || `Enhanced ${text}`;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enhanceText,
    isLoading,
  };
};
