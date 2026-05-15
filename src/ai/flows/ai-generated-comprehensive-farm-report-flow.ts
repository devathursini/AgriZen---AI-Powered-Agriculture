
'use server';
/**
 * @fileOverview A Genkit flow for generating a comprehensive farm report in PDF format for AgriZen AI.
 * 
 * It uses PDFKit to generate a real PDF document as a base64 data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import PDFDocument from 'pdfkit';

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

// Real PDF generation tool
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
    
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).fillColor('#00FF66').text('AGRIZEN AI', { align: 'center' });
      doc.fontSize(18).fillColor('#333333').text('COMPREHENSIVE FARM REPORT', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).fillColor('#666666').text(`Generated: ${new Date(input.reportTimestamp).toLocaleString()}`, { align: 'right' });
      doc.moveDown();
      doc.strokeColor('#00FF66').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Title Section
      doc.fontSize(14).fillColor('#000000').text(input.reportTitle, { bold: true });
      doc.moveDown();

      // Summary Content
      doc.fontSize(11).fillColor('#333333').text(input.reportSummary, { lineGap: 4 });
      
      // Footer
      doc.moveDown(2);
      doc.strokeColor('#EEEEEE').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc.fontSize(9).fillColor('#999999').text('This intelligence report was autonomously generated by the AgriZen Neural Core. All metrics are derived from real-time IoT and Satellite feeds.', { align: 'center' });
      
      doc.end();
    });

    return `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
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
- **Weather Data:**
  - Temperature: {{{weatherData.temperature}}}°C
  - Humidity: {{{weatherData.humidity}}}%
  - Rain Probability: {{{weatherData.rainProbability}}}%
- **Soil Data:**
  - Soil Type: {{{soilData.soilType}}}
  - pH Value: {{{soilData.phValue}}}
  - Moisture Level: {{{soilData.moistureLevel}}}%

{{#if diseaseDiagnosis}}
## Zen Crop Disease Diagnosis:
- Disease: {{{diseaseDiagnosis.diseaseName}}}
- Severity: {{{diseaseDiagnosis.severity}}}
- Confidence Score: {{{diseaseDiagnosis.confidenceScore}}}%
- Suggested Treatments:
{{#each diseaseDiagnosis.treatmentSuggestions}}
  - {{{this}}}
{{/each}}
{{/if}}

{{#if yieldPrediction}}
## Zen Yield Prediction:
- Predicted Yield: {{{yieldPrediction.predictedYield}}} {{{yieldPrediction.unit}}}
- Estimated Profit: $ {{{yieldPrediction.profitEstimation}}}
{{/if}}

{{#if marketInsights}}
## Zen Market Insights:
- Future Price: $ {{{marketInsights.futurePrice}}} per {{{marketInsights.cropUnit}}}
- Demand Forecast: {{{marketInsights.demandForecast}}}
{{/if}}

## Recommendations:
Based on the Zen AI analysis, here are some general recommendations:
- Ensure optimal irrigation based on soil moisture levels.
- Monitor weather forecasts closely for any adverse conditions.
- Implement suggested treatments promptly if disease diagnosis is confirmed.

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
