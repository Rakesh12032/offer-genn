import React, { useState, useCallback, useMemo } from 'react';
import type { SalarySlipData } from '../types';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { SalarySlipPreview } from './SalarySlipPreview';

// @ts-ignore
const { jsPDF } = window.jspdf;
// @ts-ignore
const html2canvas = window.html2canvas;

const currentYear = new Date().getFullYear();
const currentMonth = new Date().toLocaleString('default', { month: 'long' });

export const SalarySlipGenerator: React.FC = () => {
  const [data, setData] = useState<SalarySlipData>({
    employeeName: '',
    employeeId: '',
    designation: '',
    month: currentMonth,
    year: String(currentYear),
    earnings: { basic: 0, hra: 0, specialAllowance: 0 },
    deductions: { pf: 0, professionalTax: 0, incomeTax: 0 },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = e.target;
    const type = dataset.type as keyof SalarySlipData | undefined;

    if (type === 'earnings' || type === 'deductions') {
      setData(prev => ({
        ...prev,
        [type]: { ...prev[type], [name]: parseFloat(value) || 0 },
      }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const totals = useMemo(() => {
    // FIX: The `Object.values` return type can be inferred as `unknown[]`. Using `Number()` ensures
    // that the values are treated as numbers, resolving arithmetic operation errors.
    const totalEarnings = Object.values(data.earnings).reduce((acc, val) => acc + Number(val), 0);
    const totalDeductions = Object.values(data.deductions).reduce((acc, val) => acc + Number(val), 0);
    const netSalary = totalEarnings - totalDeductions;
    return { totalEarnings, totalDeductions, netSalary };
  }, [data.earnings, data.deductions]);
  
  const downloadPdf = useCallback(() => {
    const input = document.getElementById('salary-slip-preview-content');
    if (input) {
      html2canvas(input, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const widthInPdf = pdfWidth - 20;
        const heightInPdf = widthInPdf / ratio;
        
        pdf.addImage(imgData, 'PNG', 10, 10, widthInPdf, heightInPdf);
        pdf.save(`Salary_Slip_${data.employeeName.replace(/\s/g, '_')}_${data.month}_${data.year}.pdf`);
      });
    }
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">1. Employee Details</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
            <Input label="Employee Name" name="employeeName" value={data.employeeName} onChange={handleChange} />
            <Input label="Employee ID" name="employeeId" value={data.employeeId} onChange={handleChange} />
            <Input label="Designation" name="designation" value={data.designation} onChange={handleChange} />
            <Input label="Salary Month" name="month" value={data.month} onChange={handleChange} placeholder="e.g., July"/>
            <Input label="Salary Year" name="year" value={data.year} onChange={handleChange} placeholder="e.g., 2024"/>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800">2. Earnings</h3>
                 <div className="mt-4 space-y-4 p-4 border rounded-lg bg-green-50">
                    <Input label="Basic Salary" type="number" name="basic" data-type="earnings" value={data.earnings.basic} onChange={handleChange} />
                    <Input label="House Rent Allowance (HRA)" type="number" name="hra" data-type="earnings" value={data.earnings.hra} onChange={handleChange} />
                    <Input label="Special Allowance" type="number" name="specialAllowance" data-type="earnings" value={data.earnings.specialAllowance} onChange={handleChange} />
                 </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-800">3. Deductions</h3>
                 <div className="mt-4 space-y-4 p-4 border rounded-lg bg-red-50">
                    <Input label="Provident Fund (PF)" type="number" name="pf" data-type="deductions" value={data.deductions.pf} onChange={handleChange} />
                    <Input label="Professional Tax" type="number" name="professionalTax" data-type="deductions" value={data.deductions.professionalTax} onChange={handleChange} />
                    <Input label="Income Tax (TDS)" type="number" name="incomeTax" data-type="deductions" value={data.deductions.incomeTax} onChange={handleChange} />
                 </div>
            </div>
        </div>
        
        <div>
          <Button onClick={downloadPdf} variant="primary">
            Download Salary Slip as PDF
          </Button>
        </div>

      </div>

      {/* Preview Section */}
      <div className="md:pl-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Preview</h3>
        <SalarySlipPreview data={data} totals={totals} />
      </div>
    </div>
  );
};