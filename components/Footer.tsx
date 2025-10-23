
import React from 'react';
import { COMPANY_ADDRESS, COMPANY_CIN, COMPANY_NAME } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-auto py-4 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center text-gray-500 text-xs">
        <p className="font-semibold">{COMPANY_NAME}</p>
        <p>{COMPANY_ADDRESS}</p>
        <p>CIN: {COMPANY_CIN}</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
      </div>
    </footer>
  );
};
