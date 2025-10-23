
export enum LetterType {
  Offer = "Offer Letter",
  Appointment = "Appointment Letter",
  Relieving = "Relieving Letter",
  Experience = "Experience Letter",
}

export interface CandidateDetails {
  name: string;
  address: string;
  position: string;
  joiningDate: string;
  reportingManager: string;
  lastWorkingDay?: string; // For relieving/experience letters
}

export interface SalaryDetails {
  annualCTC: string;
}

export interface SalarySlipData {
    employeeName: string;
    employeeId: string;
    designation: string;
    month: string;
    year: string;
    earnings: {
        basic: number;
        hra: number;
        specialAllowance: number;
    };
    deductions: {
        pf: number;
        professionalTax: number;
        incomeTax: number;
    };
}

export type ViewType = 'Letter' | 'SalarySlip';
