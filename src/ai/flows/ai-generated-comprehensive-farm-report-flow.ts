'use server';
/**
 * @fileOverview A Genkit flow for generating a comprehensive farm report in PDF format.
 *
 * - aiGeneratedComprehensiveFarmReport - A function that orchestrates the generation of a comprehensive farm report.
 * - ComprehensiveFarmReportInput - The input type for the aiGeneratedComprehensiveFarmReport function.
 * - ComprehensiveFarmReportOutput - The return type for the aiGeneratedComprehensiveFarmReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

// Mock PDF generation tool
// In a real application, this would call a backend service (e.g., Python ReportLab)
// to generate and store the PDF, returning its accessible URL.
const generatePdfReportTool = ai.defineTool(
  {
    name: 'generatePdfReport',
    description: 'Generates a comprehensive farm report in PDF format from the provided content and metadata.',
    inputSchema: z.object({
      reportTitle: z.string().describe('Title of the report.'),
      reportSummary: z.string().describe('The AI-generated textual summary of the report content.'),
      farmerName: z.string(),
      farmLocation: z.string(),
      cropType: z.string(),
      reportTimestamp: z.string(),
      // Potentially pass all structured data here if the PDF tool needs to render it.
      // For simplicity, we'll assume reportSummary is the main content.
      // In a real scenario, this would include all relevant fields for PDF templating.
    }),
    outputSchema: z.string().url().describe('The URL to the generated PDF report.'),
  },
  async (input) => {
    // Simulate PDF generation and storage
    // In a production environment, this would involve an API call to a PDF generation service.
    const mockReportId = `report-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const mockReportUrl = `https://veridianiq.com/reports/${mockReportId}.pdf`;
    console.log(`Simulating PDF report generation for: ${input.reportTitle}`);
    console.log(`Report Summary (first 100 chars): ${input.reportSummary.substring(0, 100)}...`);
    return mockReportUrl;
  }
);

// Prompt definition to generate the report summary text
const generateReportSummaryPrompt = ai.definePrompt({
  name: 'generateReportSummaryPrompt',
  input: {schema: ComprehensiveFarmReportInputSchema},
  output: {schema: z.object({reportText: z.string().describe('The comprehensive summary text for the farm report.')})},
  prompt: `You are an expert agricultural AI assistant. Your task is to generate a comprehensive and professional farm report summary based on the provided data.
The report should be structured clearly, covering farmer details, crop specifics, environmental conditions, and any AI findings such as disease diagnosis, yield predictions, or market insights.
Focus on clarity, conciseness, and actionable insights.

---
REPORT START

# Comprehensive Farm Report

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
## AI Crop Disease Diagnosis:
- Disease: {{{diseaseDiagnosis.diseaseName}}}
- Severity: {{{diseaseDiagnosis.severity}}}
- Confidence Score: {{{diseaseDiagnosis.confidenceScore}}}%
- Suggested Treatments:
{{#each diseaseDiagnosis.treatmentSuggestions}}
  - {{{this}}}
{{/each}}
{{/if}}

{{#if yieldPrediction}}
## AI Yield Prediction:
- Predicted Yield: {{{yieldPrediction.predictedYield}}} {{{yieldPrediction.unit}}}
- Estimated Profit: $ {{{yieldPrediction.profitEstimation}}}
{{/if}}

{{#if marketInsights}}
## AI Market Insights:
- Future Price: $ {{{marketInsights.futurePrice}}} per {{{marketInsights.cropUnit}}}
- Demand Forecast: {{{marketInsights.demandForecast}}}
{{/if}}

## Recommendations:
Based on the analysis, here are some general recommendations:
- Ensure optimal irrigation based on soil moisture levels.
- Monitor weather forecasts closely for any adverse conditions.
- Implement suggested treatments promptly if disease diagnosis is confirmed.
- Consider market insights for optimal selling times.

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
      reportTitle: `Farm Report for ${input.cropType} by ${input.farmerName}`,
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
