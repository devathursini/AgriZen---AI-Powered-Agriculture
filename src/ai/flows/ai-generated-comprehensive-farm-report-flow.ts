'use server';
/**
 * @fileOverview A Genkit flow for generating a comprehensive farm report in PDF format for AgriZen AI.
 * 
 * It uses jsPDF to generate a real PDF document as a base64 data URI, avoiding filesystem issues.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { jsPDF } from 'jspdf';

// Input Schema
const ComprehensiveFarmReportInputSchema = z.object({
  farmerName: z.string().describe('Name of the farmer.'),
  farmLocation: z.string().describe('Geographical location of the farm.'),
  cropType: z.string().describe('Type of crop for which the report is generated.'),
  plantingDate: z.string().describe('Date when the crop was planted (e.g., "YYYY-MM-DD").'),
  diseaseDiagnosis: z.object({
    diseaseName: z.string().describe('Name of the detected disease.'),
    severity: z.string().describe('Severity level of the disease (e.g., "Low", "Medium", "High").'),
    treatmentSuggestions: z.array(z.string()).describe('List of suggested treatments for the disease.'),
    confidenceScore: z.number().describe('AI confidence score for the diagnosis (0-100).'),
  }).optional().describe('Details of any crop disease diagnosed.'),
  yieldPrediction: z.object({
    predictedYield: z.number().describe('Predicted yield quantity.'),
    unit: z.string().describe('Unit of measurement for the yield (e.g., "tons", "bushels").'),
    profitEstimation: z.number().describe('Estimated profit from the predicted yield.'),
  }).optional().describe('Details of the crop yield prediction.'),
  marketInsights: z.object({
    futurePrice: z.number().describe('Predicted future market price per unit.'),
    cropUnit: z.string().describe('Unit of the crop for market price (e.g., "kg", "quintal").'),
    demandForecast: z.string().describe('Forecast for market demand (e.g., "High", "Medium", "Low").'),
  }).optional().describe('Insights into future market prices and demand.'),
  weatherData: z.object({
    temperature: z.number().describe('Current or average temperature in Celsius.'),
    humidity: z.number().describe('Current or average humidity percentage.'),
    rainProbability: z.number().describe('Probability of rain percentage.'),
  }).describe('Environmental weather data.'),
  soilData: z.object({
    soilType: z.string().describe('Type of soil (e.g., "Loamy", "Clay", "Sandy").'),
    phValue: z.number().describe('pH value of the soil.'),
    moistureLevel: z.number().describe('Soil moisture level percentage.'),
  }).describe('Soil analysis data.'),
  reportTimestamp: z.string().describe('Timestamp when the report is generated (ISO string format).'),
});
export type ComprehensiveFarmReportInput = z.infer<typeof ComprehensiveFarmReportInputSchema>;

// Output Schema
const ComprehensiveFarmReportOutputSchema = z.object({
  reportUrl: z.string().url().describe('URL to the generated comprehensive farm report in PDF format.'),
});
export type ComprehensiveFarmReportOutput = z.infer<typeof ComprehensiveFarmReportOutputSchema>;

// Real PDF generation tool using jsPDF
const generatePdfReportTool = ai.defineTool(
  {
    name: 'generatePdfReport',
    description: 'Generates a comprehensive farm report in PDF format from the provided content and metadata for AgriZen AI.',
    inputSchema: z.object({
      reportTitle: z.string().describe('Title of the report.'),
      reportSummary: z.string().describe('The AI-generated textual summary of the report content.'),
      farmerName: z.string(),
      farmLocation: z.string(),
      cropType: z.string(),
      reportTimestamp: z.string(),
    }),
    outputSchema: z.string().url().describe('The URL to the generated PDF report.'),
  },
  async (input) => {
    console.log(`Generating Real Comprehensive PDF report for: ${input.reportTitle}`);
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setTextColor(0, 200, 80); // Primary Green
    doc.setFontSize(22);
    doc.text('AGRIZEN AI', pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(14);
    doc.text('COMPREHENSIVE FARM REPORT', pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    const dateStr = new Date(input.reportTimestamp).toLocaleString();
    doc.text(`Generated: ${dateStr}`, pageWidth - margin, y, { align: 'right' });
    y += 5;
    
    doc.setDrawColor(0, 200, 80);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(input.reportTitle, margin, y);
    y += 15;

    // Summary Text (with wrapping)
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    const splitText = doc.splitTextToSize(input.reportSummary, pageWidth - (margin * 2));
    doc.text(splitText, margin, y);
    
    // Calculate new y based on lines
    y += (splitText.length * 6) + 20;

    // Footer
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 20;
    }
    
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    doc.setFontSize(8);
    doc.setTextColor(153, 153, 153);
    const footerText = 'This intelligence report was autonomously generated by the AgriZen Neural Core. All metrics are derived from real-time IoT and Satellite feeds.';
    const splitFooter = doc.splitTextToSize(footerText, pageWidth - (margin * 2));
    doc.text(splitFooter, pageWidth / 2, y, { align: 'center' });

    // Use datauristring for direct browser viewing/download
    return doc.output('datauristring');
  }
);

// Prompt definition to generate the report summary text
const generateReportSummaryPrompt = ai.definePrompt({
  name: 'generateReportSummaryPrompt',
  input: {schema: ComprehensiveFarmReportInputSchema},
  output: {schema: z.object({reportText: z.string().describe('The comprehensive summary text for the farm report.')})},
  prompt: `You are an expert AgriZen AI assistant. Your task is to generate a comprehensive and professional farm report summary based on the provided data.
The report should be structured clearly, covering farmer details, crop specifics, environmental conditions, and any AI findings.

---
REPORT START

# AgriZen Comprehensive Farm Report

## Farmer and Farm Details:
- Farmer: {{{farmerName}}}
- Farm Location: {{{farmLocation}}}
- Report Date: {{{reportTimestamp}}}

## Crop Overview:
- Crop Type: {{{cropType}}}
- Planting Date: {{{plantingDate}}}

## Environmental Conditions:
- Weather: {{{weatherData.temperature}}}°C, {{{weatherData.humidity}}}% Humidity, {{{weatherData.rainProbability}}}% Rain Prob.
- Soil: {{{soilData.soilType}}}, pH {{{soilData.phValue}}}, {{{soilData.moistureLevel}}}% Moisture.

{{#if diseaseDiagnosis}}
## Zen Crop Disease Diagnosis:
- Disease: {{{diseaseDiagnosis.diseaseName}}} ({{{diseaseDiagnosis.severity}}})
- Confidence: {{{diseaseDiagnosis.confidenceScore}}}%
- Treatments: {{{#each diseaseDiagnosis.treatmentSuggestions}}}{{{this}}}{{#unless @last}}, {{/unless}}{{{/each}}}
{{/if}}

{{#if yieldPrediction}}
## Zen Yield Prediction:
- Predicted Yield: {{{yieldPrediction.predictedYield}}} {{{yieldPrediction.unit}}}
- Est. Profit: $ {{{yieldPrediction.profitEstimation}}}
{{/if}}

{{#if marketInsights}}
## Zen Market Insights:
- Future Price: $ {{{marketInsights.futurePrice}}} per {{{marketInsights.cropUnit}}} (Demand: {{{marketInsights.demandForecast}}})
{{/if}}

## AI Recommendations:
Optimized irrigation suggested for current soil moisture. Monitor weather patterns. Implement disease mitigation protocols if threats were identified.

---
REPORT END

Please generate the complete report text following this structure.`,
});


// Define the Genkit flow
const aiGeneratedComprehensiveFarmReportFlow = ai.defineFlow(
  {
    name: 'aiGeneratedComprehensiveFarmReportFlow',
    inputSchema: ComprehensiveFarmReportInputSchema,
    outputSchema: ComprehensiveFarmReportOutputSchema,
  },
  async (input) => {
    // 1. Generate the textual summary using the prompt
    const { output: promptOutput } = await generateReportSummaryPrompt(input);
    const reportSummary = promptOutput?.reportText;

    if (!reportSummary) {
      throw new Error('Failed to generate report summary text.');
    }

    // 2. Call the PDF generation tool with the summary and relevant metadata
    const reportUrl = await generatePdfReportTool({
      reportTitle: `AgriZen Farm Report for ${input.cropType} by ${input.farmerName}`,
      reportSummary: reportSummary,
      farmerName: input.farmerName,
      farmLocation: input.farmLocation,
      cropType: input.cropType,
      reportTimestamp: input.reportTimestamp,
    });

    return { reportUrl };
  }
);

// Export the wrapper function
export async function aiGeneratedComprehensiveFarmReport(
  input: ComprehensiveFarmReportInput
): Promise<ComprehensiveFarmReportOutput> {
  return aiGeneratedComprehensiveFarmReportFlow(input);
}
