'use server';
/**
 * @fileOverview An AI agent for detecting crop diseases and pests, providing diagnosis and treatment recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NeuralCropDiagnosisRecommendationsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop or leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropType: z
    .string()
    .optional()
    .describe(
      'Optional. The type of crop (e.g., "Tomato", "Potato", "Corn", "Rice", "Wheat") to help the AI focus its diagnosis.'
    ),
});
export type NeuralCropDiagnosisRecommendationsInput = z.infer<
  typeof NeuralCropDiagnosisRecommendationsInputSchema
>;

const NeuralCropDiagnosisRecommendationsOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the input image contains a plant or plant part.'),
    commonName: z
      .string()
      .describe('The common name of the identified plant (e.g., "Tomato plant").'),
    latinName: z
      .string()
      .describe('The Latin name of the identified plant (e.g., "Solanum lycopersicum").'),
  }).describe('Identification details of the plant in the image.'),
  diagnosis: z.object({
    isHealthy: z
      .boolean()
      .describe('Whether or not the plant is healthy based on the diagnosis.'),
    diseaseName: z
      .string()
      .optional()
      .describe('The name of the detected disease, pest, or deficiency if the plant is not healthy.'),
    confidenceScore: z
      .number()
      .min(0)
      .max(100)
      .describe('A confidence score (0-100) indicating how certain the AI is about the diagnosis.'),
    severity: z
      .enum(['None', 'Mild', 'Moderate', 'Severe', 'Critical'])
      .describe('The severity of the detected issue.'),
    description: z
      .string()
      .describe('A detailed explanation of the identified problem, including symptoms and potential causes.'),
    treatmentSuggestions: z
      .array(z.string())
      .describe('Specific treatment suggestions to address the issue.'),
    fertilizerRecommendations: z
      .array(z.string())
      .describe('Specific fertilizer recommendations if a nutrient deficiency is detected or for general plant health.'),
    organicFarmingSuggestions: z
      .array(z.string())
      .describe('Organic farming suggestions for treatment or prevention.'),
  }).describe('Detailed diagnosis of the plant health, including treatments.'),
});
export type NeuralCropDiagnosisRecommendationsOutput = z.infer<
  typeof NeuralCropDiagnosisRecommendationsOutputSchema
>;

export async function neuralCropDiagnosisRecommendations(
  input: NeuralCropDiagnosisRecommendationsInput
): Promise<NeuralCropDiagnosisRecommendationsOutput> {
  try {
    return await neuralCropDiagnosisRecommendationsFlow(input);
  } catch (error: any) {
    console.error("Diagnosis Flow Error:", error);
    throw new Error(error.message || "An unexpected error occurred during crop diagnosis.");
  }
}

const prompt = ai.definePrompt({
  name: 'neuralCropDiagnosisRecommendationsPrompt',
  input: {schema: NeuralCropDiagnosisRecommendationsInputSchema},
  output: {schema: NeuralCropDiagnosisRecommendationsOutputSchema},
  prompt: `You are an expert botanist, plant pathology, and agricultural advisor. Your task is to analyze the provided image of a crop or leaf to detect any diseases, pests, or nutrient deficiencies.
Based on your analysis, you must provide a comprehensive diagnosis including identification, health status, confidence score, severity, detailed description of the problem, and actionable treatment suggestions.
If the plant is not healthy, specify the disease/pest/deficiency.
Provide specific fertilizer recommendations if applicable, and always include organic farming suggestions.

Here is the information:
{{#if cropType}}Crop Type (for context): {{cropType}}
{{/if}}
Photo of the plant/leaf: {{media url=photoDataUri}}

Output your response in a structured JSON format as described by the output schema.`,
});

const neuralCropDiagnosisRecommendationsFlow = ai.defineFlow(
  {
    name: 'neuralCropDiagnosisRecommendationsFlow',
    inputSchema: NeuralCropDiagnosisRecommendationsInputSchema,
    outputSchema: NeuralCropDiagnosisRecommendationsOutputSchema,
  },
  async input => {
    let retries = 5;
    let lastError: any;

    while (retries >= 0) {
      try {
        const {output} = await prompt(input);
        if (!output) {
          throw new Error('Failed to get a valid diagnosis from the AI.');
        }
        return output;
      } catch (err: any) {
        lastError = err;
        const errMsg = err.message?.toLowerCase() || "";
        
        const isRateLimit = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('rate limit') || errMsg.includes('exhausted');
        const isOverload = errMsg.includes('503') || errMsg.includes('unavailable') || errMsg.includes('high demand');

        if ((isRateLimit || isOverload) && retries > 0) {
          const attempt = 5 - retries;
          retries--;
          const waitTime = isRateLimit ? 10000 * Math.pow(2, attempt) : 2000;
          
          console.log(`AgriZen Neural Link (Diagnosis): Quota or overload detected. Retrying in ${waitTime}ms... (${retries + 1} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  }
);
