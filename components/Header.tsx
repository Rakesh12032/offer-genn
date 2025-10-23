
import React from 'react';
import { Logo } from './common/Logo';
import { COMPANY_NAME } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo />
          <h1 className="text-xl md:text-2xl font-bold text-brand-blue tracking-tight">
            {COMPANY_NAME}
          </h1>
        </div>
        <h2 className="hidden sm:block text-lg font-semibold text-gray-600">HR Document Suite</h2>
      </div>
    </header>
  );
};
