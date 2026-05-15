import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      // Use the provided valid Gemini API key
      apiKey: "AIzaSyCKcMp5qt7lYNSI6x85IoAl-SZCOJg-jNw" || process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
