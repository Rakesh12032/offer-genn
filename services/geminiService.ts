
import { GoogleGenAI } from "@google/genai";
import { COMPANY_NAME, COMPANY_CIN, COMPANY_ADDRESS } from '../constants';
import type { LetterType, CandidateDetails, SalaryDetails } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const createPrompt = (letterType: LetterType, candidate: CandidateDetails, salary: SalaryDetails): string => {
  let prompt = `
You are an expert HR Manager for '${COMPANY_NAME}'. Your task is to generate a formal and professional ${letterType}. 
The output MUST be a single block of well-structured HTML content, using tags like <p>, <strong>, <b>, <ul>, and <li> for formatting. 
Do NOT include <html>, <head>, or <body> tags. The entire response should be inside a single root <div> tag.

Company Details:
- Name: ${COMPANY_NAME}
- CIN: ${COMPANY_CIN}
- Address: ${COMPANY_ADDRESS}

Candidate Details:
- Name: ${candidate.name}
- Address: ${candidate.address}
- Position: ${candidate.position}
- Date of Joining: ${candidate.joiningDate}
${candidate.lastWorkingDay ? `- Last Working Day: ${candidate.lastWorkingDay}` : ''}
${candidate.reportingManager ? `- Reporting Manager: ${candidate.reportingManager}` : ''}

Salary Details:
- Annual CTC: ${salary.annualCTC} INR

---

Based on the details above, generate the full content for a professional ${letterType}.

`;

  switch (letterType) {
    case 'Offer Letter':
      prompt += `The letter should include:
      1. Introduction and formal offer for the position of ${candidate.position}.
      2. Compensation and Benefits, clearly stating the Annual CTC of ${salary.annualCTC}.
      3. Date of Joining and reporting details.
      4. Key terms like a probation period (e.g., 6 months).
      5. A section for the candidate to sign and accept the offer.
      6. A warm and professional closing.`;
      break;
    case 'Appointment Letter':
      prompt += `This letter confirms the appointment of ${candidate.name}. It should be more detailed than the offer letter. Include:
      1. Confirmation of appointment to the role of ${candidate.position}.
      2. Detailed salary breakdown (You can create a sample breakdown based on the CTC of ${salary.annualCTC}).
      3. Detailed terms and conditions of employment (probation, notice period, confidentiality, code of conduct).
      4. Job responsibilities and duties.
      5. A professional closing.`;
      break;
    case 'Relieving Letter':
      prompt += `This letter is to certify that ${candidate.name} has been relieved from their duties as ${candidate.position}. Include:
      1. Acceptance of the employee's resignation.
      2. The employee's designation at the time of leaving.
      3. The effective date of relieving / last working day: ${candidate.lastWorkingDay}.
      4. A statement wishing the employee well for their future endeavors.
      5. Mention that final settlement will be processed as per company policy.`;
      break;
    case 'Experience Letter':
      prompt += `This is to certify that ${candidate.name} was employed with us. The letter must contain:
      1. The duration of employment, from ${candidate.joiningDate} to ${candidate.lastWorkingDay}.
      2. The designation held by the employee at the time of leaving (${candidate.position}).
      3. A brief, positive note on their conduct and performance (e.g., "was found to be sincere and hardworking").
      4. A wish for success in their future career.`;
      break;
  }

  return prompt;
};


export const generateLetterContent = async (
  letterType: LetterType,
  candidateDetails: CandidateDetails,
  salaryDetails: SalaryDetails
): Promise<string> => {
  const prompt = createPrompt(letterType, candidateDetails, salaryDetails);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return `<div class="text-red-500">
              <p><strong>Error:</strong> Failed to generate letter content.</p>
              <p>Please check your API key and network connection. The error details have been logged to the console.</p>
           </div>`;
  }
};
