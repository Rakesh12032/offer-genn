
import React from 'react';

interface LetterPreviewProps {
  content: string;
  isLoading: boolean;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({ content, isLoading }) => {
  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-inner p-2 h-[600px] overflow-auto">
      <div id="letter-preview-content" className="p-6 bg-white min-h-full font-serif text-sm">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="animate-spin mx-auto h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">Generating content with AI...</p>
            </div>
          </div>
        )}
        {!isLoading && !content && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Your generated letter will appear here.</p>
          </div>
        )}
        {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
      </div>
    </div>
  );
};
