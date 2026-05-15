
'use server';
/**
 * @fileOverview A Genkit flow for generating a professional PDF report specifically for a crop diagnosis.
 *
 * - generateDiagnosisPdfReport - A function that orchestrates the generation of a detailed diagnosis report.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiagnosisPdfInputSchema = z.object({
  identification: z.object({
    commonName: z.string(),
    latinName: z.string(),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean(),
    diseaseName: z.string().optional(),
    confidenceScore: z.number(),
    severity: z.string(),
    description: z.string(),
    treatmentSuggestions: z.array(z.string()),
    fertilizerRecommendations: z.array(z.string()).optional(),
    organicFarmingSuggestions: z.array(z.string()).optional(),
  }),
  timestamp: z.string(),
});
export type GenerateDiagnosisPdfInput = z.infer<typeof GenerateDiagnosisPdfInputSchema>;

const GenerateDiagnosisPdfOutputSchema = z.object({
  reportUrl: z.string().url(),
});
export type GenerateDiagnosisPdfOutput = z.infer<typeof GenerateDiagnosisPdfOutputSchema>;

const generateDiagnosisPdfTool = ai.defineTool(
  {
    name: 'generateDiagnosisPdf',
    description: 'Generates a PDF diagnosis report with detailed AI findings for AgriZen AI.',
    inputSchema: z.object({
      content: z.string().describe('The full text content of the diagnosis report.'),
      plantName: z.string().describe('Name of the plant analyzed.'),
      diagnosisResult: z.string().describe('The core diagnosis result (e.g. Healthy or Disease Name).'),
    }),
    outputSchema: z.string().url(),
  },
  async (input) => {
    console.log(`Generating Detailed Diagnosis PDF for: ${input.plantName}`);
    console.log(`Diagnosis Summary: ${input.diagnosisResult}`);
    // In a production environment, this tool would call a PDF generation service (like Puppeteer or a Cloud Function).
    // Returning a stable sample PDF for the preview.
    return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  }
);

const generateDiagnosisPdfReportFlow = ai.defineFlow(
  {
    name: 'generateDiagnosisPdfReportFlow',
    inputSchema: GenerateDiagnosisPdfInputSchema,
    outputSchema: GenerateDiagnosisPdfOutputSchema,
  },
  async (input) => {
    const { identification, diagnosis, timestamp } = input;
    
    const reportContent = `
=========================================
AGRIZEN AI: CROP DIAGNOSIS REPORT
=========================================
Report Generated: ${new Date(timestamp).toLocaleString()}

PLANT IDENTIFICATION
-----------------------------------------
Common Name: ${identification.commonName}
Latin Name:  ${identification.latinName}

HEALTH ASSESSMENT
-----------------------------------------
Status: ${diagnosis.isHealthy ? 'HEALTHY' : 'THREAT DETECTED'}
Diagnosis: ${diagnosis.diseaseName || 'No specific disease detected'}
Confidence: ${diagnosis.confidenceScore}%
Severity: ${diagnosis.severity}

DETAILED ANALYSIS
-----------------------------------------
${diagnosis.description}

RECOMMENDED TREATMENT PLAN
-----------------------------------------
${diagnosis.treatmentSuggestions.map(s => `- ${s}`).join('\n')}

FERTILIZER RECOMMENDATIONS
-----------------------------------------
${diagnosis.fertilizerRecommendations?.length ? diagnosis.fertilizerRecommendations.map(s => `- ${s}`).join('\n') : 'No specific fertilizer adjustments required.'}

ORGANIC FARMING SUGGESTIONS
-----------------------------------------
${diagnosis.organicFarmingSuggestions?.length ? diagnosis.organicFarmingSuggestions.map(s => `- ${s}`).join('\n') : 'General organic maintenance recommended.'}

=========================================
This report was generated using AgriZen 
Neural Vision Engine v4.0.
=========================================
    `;

    const reportUrl = await generateDiagnosisPdfTool({
      content: reportContent,
      plantName: identification.commonName,
      diagnosisResult: diagnosis.isHealthy ? 'Healthy' : (diagnosis.diseaseName || 'Issue Detected'),
    });

    return { reportUrl };
  }
);

export async function generateDiagnosisPdfReport(
  input: GenerateDiagnosisPdfInput
): Promise<GenerateDiagnosisPdfOutput> {
  return generateDiagnosisPdfReportFlow(input);
}
