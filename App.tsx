
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LetterGenerator } from './components/LetterGenerator';
import { SalarySlipGenerator } from './components/SalarySlipGenerator';
import type { ViewType } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('Letter');

  const renderView = () => {
    switch (activeView) {
      case 'Letter':
        return <LetterGenerator />;
      case 'SalarySlip':
        return <SalarySlipGenerator />;
      default:
        return <LetterGenerator />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-2 p-2" aria-label="Tabs">
                <button
                  onClick={() => setActiveView('Letter')}
                  className={`${
                    activeView === 'Letter'
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } px-4 py-2 font-medium text-sm rounded-md transition-colors duration-200`}
                >
                  HR Letter Generator
                </button>
                <button
                  onClick={() => setActiveView('SalarySlip')}
                  className={`${
                    activeView === 'SalarySlip'
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } px-4 py-2 font-medium text-sm rounded-md transition-colors duration-200`}
                >
                  Salary Slip Generator
                </button>
              </nav>
            </div>
            <div className="p-6 md:p-8">
              {renderView()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
