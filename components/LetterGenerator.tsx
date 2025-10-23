import React, { useState, useCallback, useMemo } from 'react';
import { LetterType } from '../types';
import type { CandidateDetails, SalaryDetails } from '../types';
import { generateLetterContent } from '../services/geminiService';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { Button } from './common/Button';
import { LetterPreview } from './LetterPreview';

// @ts-ignore
const { jsPDF } = window.jspdf;
// @ts-ignore
const html2canvas = window.html2canvas;

export const LetterGenerator: React.FC = () => {
  const [letterType, setLetterType] = useState<LetterType>(LetterType.Offer);
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails>({
    name: '',
    address: '',
    position: '',
    joiningDate: new Date().toISOString().split('T')[0],
    reportingManager: '',
    lastWorkingDay: '',
  });
  const [salaryDetails, setSalaryDetails] = useState<SalaryDetails>({
    annualCTC: '',
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCandidateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCandidateDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSalaryDetails(prev => ({ ...prev, [name]: value }));
     if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!candidateDetails.name.trim()) newErrors.name = 'Candidate name is required.';
    else if (candidateDetails.name.length > 100) newErrors.name = 'Name cannot exceed 100 characters.';

    if (!candidateDetails.address.trim()) newErrors.address = 'Candidate address is required.';
    else if (candidateDetails.address.length > 250) newErrors.address = 'Address cannot exceed 250 characters.';

    if (!candidateDetails.position.trim()) newErrors.position = 'Position is required.';
    else if (candidateDetails.position.length > 100) newErrors.position = 'Position cannot exceed 100 characters.';

    if (!salaryDetails.annualCTC.trim()) {
      newErrors.annualCTC = 'Annual CTC is required.';
    } else if (isNaN(parseFloat(salaryDetails.annualCTC.replace(/,/g, ''))) || parseFloat(salaryDetails.annualCTC.replace(/,/g, '')) <= 0) {
      newErrors.annualCTC = 'Please enter a valid positive number for CTC.';
    }

    if (!candidateDetails.joiningDate) {
      newErrors.joiningDate = 'Joining date is required.';
    } else if (isNaN(new Date(candidateDetails.joiningDate).getTime())) {
      newErrors.joiningDate = 'Invalid date format.';
    }
    
    const isRelievingOrExp = letterType === LetterType.Relieving || letterType === LetterType.Experience;

    if (!isRelievingOrExp) {
      if (!candidateDetails.reportingManager.trim()) {
        newErrors.reportingManager = 'Reporting manager is required.';
      } else if (candidateDetails.reportingManager.length > 100) {
        newErrors.reportingManager = 'Manager name cannot exceed 100 characters.';
      }
    }

    if (isRelievingOrExp) {
      if (!candidateDetails.lastWorkingDay) {
        newErrors.lastWorkingDay = 'Last working day is required.';
      } else {
        const joiningDate = new Date(candidateDetails.joiningDate);
        const lastDay = new Date(candidateDetails.lastWorkingDay);
        if (isNaN(lastDay.getTime())) {
          newErrors.lastWorkingDay = 'Invalid date format.';
        } else if (joiningDate >= lastDay) {
          newErrors.lastWorkingDay = 'Last working day must be after the joining date.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) {
      return;
    }
    setIsLoading(true);
    setGeneratedContent('');
    const content = await generateLetterContent(letterType, candidateDetails, salaryDetails);
    setGeneratedContent(content);
    setIsLoading(false);
  };
  
  const downloadPdf = useCallback(() => {
    const input = document.getElementById('letter-preview-content');
    if (input) {
      html2canvas(input, { scale: 2, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const widthInPdf = pdfWidth - 20;
        const heightInPdf = widthInPdf / ratio;
        let finalHeight = heightInPdf;
        if (heightInPdf > pdfHeight - 20) {
            finalHeight = pdfHeight - 20;
        }
        
        pdf.addImage(imgData, 'PNG', 10, 10, widthInPdf, finalHeight);
        pdf.save(`${letterType.replace(/\s/g, '_')}_${candidateDetails.name.replace(/\s/g, '_')}.pdf`);
      });
    }
  }, [letterType, candidateDetails.name]);
  
  const isRelievingOrExperience = useMemo(() => letterType === LetterType.Relieving || letterType === LetterType.Experience, [letterType]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">1. Select Letter Type</h3>
          <Select id="letterType" label="Letter Type" value={letterType} onChange={e => { setLetterType(e.target.value as LetterType); setErrors({}); }}>
            {Object.values(LetterType).map(type => <option key={type} value={type}>{type}</option>)}
          </Select>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-800">2. Enter Details</h3>
          <div className="mt-4 space-y-4 p-4 border rounded-lg bg-gray-50">
            <Input label="Candidate Name" id="name" name="name" value={candidateDetails.name} onChange={handleCandidateChange} required error={errors.name} />
            <Input label="Candidate Address" id="address" name="address" value={candidateDetails.address} onChange={handleCandidateChange} required error={errors.address} />
            <Input label="Position / Designation" id="position" name="position" value={candidateDetails.position} onChange={handleCandidateChange} required error={errors.position} />
            <Input label="Annual CTC (e.g., 5,00,000)" id="annualCTC" name="annualCTC" value={salaryDetails.annualCTC} onChange={handleSalaryChange} required error={errors.annualCTC} />
            
            <Input type="date" label={isRelievingOrExperience ? "Original Joining Date" : "Joining Date"} id="joiningDate" name="joiningDate" value={candidateDetails.joiningDate} onChange={handleCandidateChange} required error={errors.joiningDate} />
            
            {!isRelievingOrExperience && <Input label="Reporting Manager" id="reportingManager" name="reportingManager" value={candidateDetails.reportingManager} onChange={handleCandidateChange} error={errors.reportingManager} />}
            
            {isRelievingOrExperience && <Input type="date" label="Last Working Day" id="lastWorkingDay" name="lastWorkingDay" value={candidateDetails.lastWorkingDay} onChange={handleCandidateChange} error={errors.lastWorkingDay} />}
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleGenerate} isLoading={isLoading}>
            Generate Letter
          </Button>
          <Button onClick={downloadPdf} variant="secondary" disabled={!generatedContent}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="md:pl-4">
         <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Preview</h3>
        <LetterPreview content={generatedContent} isLoading={isLoading} />
      </div>
    </div>
  );
};
