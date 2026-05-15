
'use server';
/**
 * @fileOverview A Genkit flow for generating a professional PDF report specifically for a crop diagnosis.
 * 
 * It uses jsPDF to generate a real PDF document as a base64 data URI, avoiding filesystem issues.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { jsPDF } from 'jspdf';

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
    console.log(`Generating Real Diagnosis PDF for: ${input.plantName}`);
    
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setTextColor(0, 255, 102); // AgriZen Green
    doc.setFontSize(22);
    doc.text('AGRIZEN AI', pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(14);
    doc.text('CROP DIAGNOSIS REPORT', pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, y, { align: 'right' });
    y += 5;
    
    doc.setDrawColor(0, 255, 102);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(input.content, pageWidth - (margin * 2));
    
    // Handle pagination
    lines.forEach((line: string) => {
      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 6;
    });
    
    // Footer
    y = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(9);
    doc.setTextColor(153, 153, 153);
    doc.text('This report was generated using AgriZen Neural Vision Engine v4.0. Precision data for modern farming.', pageWidth / 2, y, { align: 'center' });
    
    return doc.output('datauristring');
  }
);

const generateDiagnosisPdfReportFlow = ai.defineFlow(
  {
    name: 'generateDiagnosisPdfReportFlow',
    inputSchema: GenerateDiagnosisPdfInputSchema,
    outputSchema: GenerateDiagnosisPdfOutputSchema,
  },
  async (input) => {
    const { identification, diagnosis } = input;
    
    const reportContent = `
PLANT IDENTIFICATION
Common Name: ${identification.commonName}
Latin Name: ${identification.latinName}

HEALTH ASSESSMENT
Status: ${diagnosis.isHealthy ? 'HEALTHY' : 'THREAT DETECTED'}
Diagnosis: ${diagnosis.diseaseName || 'No specific disease detected'}
Confidence: ${diagnosis.confidenceScore}%
Severity: ${diagnosis.severity}

DETAILED ANALYSIS
${diagnosis.description}

RECOMMENDED TREATMENT PLAN
${diagnosis.treatmentSuggestions.map(s => `- ${s}`).join('\n')}

FERTILIZER RECOMMENDATIONS
${diagnosis.fertilizerRecommendations?.length ? diagnosis.fertilizerRecommendations.map(s => `- ${s}`).join('\n') : 'No specific fertilizer adjustments required.'}

ORGANIC FARMING SUGGESTIONS
${diagnosis.organicFarmingSuggestions?.length ? diagnosis.organicFarmingSuggestions.map(s => `- ${s}`).join('\n') : 'General organic maintenance recommended.'}
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
