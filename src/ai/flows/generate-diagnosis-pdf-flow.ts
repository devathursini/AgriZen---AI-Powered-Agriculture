
'use server';
/**
 * @fileOverview A Genkit flow for generating a professional PDF report specifically for a crop diagnosis.
 * 
 * It uses PDFKit to generate a real PDF document as a base64 data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import PDFDocument from 'pdfkit';

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
    
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).fillColor('#00FF66').text('AGRIZEN AI', { align: 'center' });
      doc.fontSize(16).fillColor('#333333').text('CROP DIAGNOSIS REPORT', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).fillColor('#666666').text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown();
      doc.strokeColor('#00FF66').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Content
      doc.fontSize(12).fillColor('#000000').text(input.content);
      
      // Footer
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#999999').text('This report was generated using AgriZen Neural Vision Engine v4.0. Precision data for modern farming.', { align: 'center' });
      
      doc.end();
    });

    return `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
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
