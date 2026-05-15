'use server';
/**
 * @fileOverview A Genkit flow for predicting crop yield based on environmental and farm data.
 *
 * - neuralYieldPrediction - A function that handles the yield prediction process.
 * - YieldPredictionInput - The input type for the neuralYieldPrediction function.
 * - YieldPredictionOutput - The return type for the neuralYieldPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YieldPredictionInputSchema = z.object({
  cropType: z.string().describe('The type of crop (e.g., Tomato, Wheat, Corn).'),
  areaSize: z.number().describe('The size of the farm area in acres.'),
  soilPh: z.number().describe('The current pH level of the soil.'),
  expectedRainfall: z.number().describe('The expected rainfall in mm for the season.'),
  avgTemperature: z.number().describe('The average expected temperature in Celsius.'),
  historicalYield: z.number().optional().describe('Optional previous yield data in tons/acre.'),
});
export type YieldPredictionInput = z.infer<typeof YieldPredictionInputSchema>;

const YieldPredictionOutputSchema = z.object({
  predictedYield: z.number().describe('The predicted yield in tons.'),
  yieldPerAcre: z.number().describe('The predicted yield per acre.'),
  confidenceScore: z.number().min(0).max(100).describe('AI confidence score (0-100).'),
  riskFactors: z.array(z.string()).describe('Potential risks identified (e.g., "Low Rainfall", "pH Imbalance").'),
  recommendations: z.array(z.string()).describe('Actionable steps to optimize yield.'),
  marketValueEstimation: z.number().describe('Estimated market value of the predicted yield in USD.'),
});
export type YieldPredictionOutput = z.infer<typeof YieldPredictionOutputSchema>;

export async function neuralYieldPrediction(input: YieldPredictionInput): Promise<YieldPredictionOutput> {
  return neuralYieldPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'neuralYieldPredictionPrompt',
  input: {schema: YieldPredictionInputSchema},
  output: {schema: YieldPredictionOutputSchema},
  prompt: `You are a precision agriculture data scientist. Your task is to predict the crop yield for a farm based on environmental parameters.

Analyze the following data:
- Crop: {{cropType}}
- Area: {{areaSize}} acres
- Soil pH: {{soilPh}}
- Expected Rainfall: {{expectedRainfall}} mm
- Average Temperature: {{avgTemperature}}°C
{{#if historicalYield}}- Historical Yield: {{historicalYield}} tons/acre{{/if}}

Calculate a realistic predicted yield and provide a detailed analysis of risks and optimization recommendations. 
Estimate the market value assuming current global average prices for the crop type.

Output the result in structured JSON format.`,
});

const neuralYieldPredictionFlow = ai.defineFlow(
  {
    name: 'neuralYieldPredictionFlow',
    inputSchema: YieldPredictionInputSchema,
    outputSchema: YieldPredictionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) throw new Error("Failed to generate yield prediction.");
    return output;
  }
);