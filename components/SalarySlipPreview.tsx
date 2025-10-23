
import React from 'react';
import { COMPANY_NAME, COMPANY_ADDRESS } from '../constants';
import type { SalarySlipData } from '../types';
import { Logo } from './common/Logo';

interface SalarySlipPreviewProps {
  data: SalarySlipData;
  totals: {
    totalEarnings: number;
    totalDeductions: number;
    netSalary: number;
  };
}

const numberToWords = (num: number): string => {
  const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
  if (isNaN(num)) return '';
  if (num === 0) return 'zero';

  const toWords = (n: number): string => {
    let str = '';
    if (n >= 10000000) { str += toWords(Math.floor(n / 10000000)) + ' crore '; n %= 10000000; }
    if (n >= 100000) { str += toWords(Math.floor(n / 100000)) + ' lakh '; n %= 100000; }
    if (n >= 1000) { str += toWords(Math.floor(n / 1000)) + ' thousand '; n %= 1000; }
    if (n >= 100) { str += toWords(Math.floor(n / 100)) + ' hundred '; n %= 100; }
    if (n > 0) {
      if (str !== '') str += 'and ';
      if (n < 20) { str += a[n]; } 
      else { str += b[Math.floor(n / 10)]; if (n % 10 !== 0) str += ' ' + a[n % 10]; }
    }
    return str;
  }
  
  let words = toWords(Math.floor(num));
  const decimalPart = Math.round((num % 1) * 100);
  if (decimalPart > 0) {
    words += ' and ' + toWords(decimalPart) + ' paise';
  }
  return words.trim().replace(/\s+/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const SalarySlipPreview: React.FC<SalarySlipPreviewProps> = ({ data, totals }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };
  
  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-inner p-2 h-[600px] overflow-auto">
      <div id="salary-slip-preview-content" className="p-6 bg-white min-h-full font-sans text-xs text-gray-800">
        <div className="border-b-2 border-gray-400 pb-2 mb-2">
            <div className="flex justify-between items-center">
                <Logo />
                <div className="text-right">
                    <h2 className="text-lg font-bold text-brand-blue">{COMPANY_NAME}</h2>
                    <p>{COMPANY_ADDRESS}</p>
                </div>
            </div>
            <h3 className="text-center font-bold text-base mt-2">Salary Slip for {data.month} {data.year}</h3>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 my-4 border p-2 rounded">
            <div className="font-bold">Employee Name:</div><div>{data.employeeName || 'N/A'}</div>
            <div className="font-bold">Employee ID:</div><div>{data.employeeId || 'N/A'}</div>
            <div className="font-bold">Designation:</div><div>{data.designation || 'N/A'}</div>
        </div>
        
        <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2 font-bold text-left">Earnings</th>
                    <th className="border p-2 font-bold text-right">Amount (INR)</th>
                    <th className="border p-2 font-bold text-left">Deductions</th>
                    <th className="border p-2 font-bold text-right">Amount (INR)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border p-2">Basic Salary</td>
                    <td className="border p-2 text-right">{formatCurrency(data.earnings.basic)}</td>
                    <td className="border p-2">Provident Fund (PF)</td>
                    <td className="border p-2 text-right">{formatCurrency(data.deductions.pf)}</td>
                </tr>
                 <tr>
                    <td className="border p-2">House Rent Allowance (HRA)</td>
                    <td className="border p-2 text-right">{formatCurrency(data.earnings.hra)}</td>
                    <td className="border p-2">Professional Tax</td>
                    <td className="border p-2 text-right">{formatCurrency(data.deductions.professionalTax)}</td>
                </tr>
                <tr>
                    <td className="border p-2">Special Allowance</td>
                    <td className="border p-2 text-right">{formatCurrency(data.earnings.specialAllowance)}</td>
                    <td className="border p-2">Income Tax (TDS)</td>
                    <td className="border p-2 text-right">{formatCurrency(data.deductions.incomeTax)}</td>
                </tr>
                <tr className="bg-gray-50 font-bold">
                    <td className="border p-2">Total Earnings</td>
                    <td className="border p-2 text-right">{formatCurrency(totals.totalEarnings)}</td>
                    <td className="border p-2">Total Deductions</td>
                    <td className="border p-2 text-right">{formatCurrency(totals.totalDeductions)}</td>
                </tr>
            </tbody>
        </table>
        
        <div className="mt-4 p-2 bg-brand-blue text-white rounded font-bold text-base flex justify-between">
            <span>Net Salary</span>
            <span>{formatCurrency(totals.netSalary)}</span>
        </div>
        <div className="mt-1 p-2 text-xs text-gray-700">
            <span className="font-bold">In Words:</span> {numberToWords(totals.netSalary)} Rupees Only
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-[10px]">
            <p>This is a computer-generated salary slip and does not require a signature.</p>
        </div>
      </div>
    </div>
  );
};
