
'use server';
/**
 * @fileOverview A Genkit flow for generating a PDF report specifically for a crop diagnosis.
 *
 * - generateDiagnosisPdfReport - A function that orchestrates the generation of a diagnosis report.
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
    description: 'Generates a PDF diagnosis report for AgriZen AI.',
    inputSchema: z.object({
      content: z.string(),
      plantName: z.string(),
    }),
    outputSchema: z.string().url(),
  },
  async (input) => {
    console.log(`Generating Diagnosis PDF for: ${input.plantName}`);
    // Mock URL for a real-looking PDF
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
    const reportContent = `
AgriZen AI Diagnosis Report
---------------------------
Date: ${input.timestamp}
Plant: ${input.identification.commonName} (${input.identification.latinName})
Status: ${input.diagnosis.isHealthy ? 'Healthy' : 'Issues Detected'}
Confidence: ${input.diagnosis.confidenceScore}%

Analysis:
${input.diagnosis.description}

Recommendations:
${input.diagnosis.treatmentSuggestions.join('\n')}
    `;

    const reportUrl = await generateDiagnosisPdfTool({
      content: reportContent,
      plantName: input.identification.commonName,
    });

    return { reportUrl };
  }
);

export async function generateDiagnosisPdfReport(
  input: GenerateDiagnosisPdfInput
): Promise<GenerateDiagnosisPdfOutput> {
  return generateDiagnosisPdfReportFlow(input);
}
