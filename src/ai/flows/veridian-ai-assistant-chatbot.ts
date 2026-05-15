
'use server';
/**
 * @fileOverview This file implements the Genkit flow for the Veridian AI Assistant Chatbot.
 * It provides an intelligent, context-aware, and multi-lingual chatbot for farmers.
 *
 * - veridianAIAssistantChatbot - A function that handles the chatbot interaction.
 * - VeridianAIAssistantChatbotInput - The input type for the veridianAIAssistantChatbot function.
 * - VeridianAIAssistantChatbotOutput - The return type for the veridianAIAssistantChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema for the chatbot
const VeridianAIAssistantChatbotInputSchema = z.object({
  query: z.string().describe('The current message or question from the farmer.'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'model', 'system']),
      content: z.array(z.object({text: z.string()})),
    })
  ).optional().describe('Previous conversation turns for context-awareness.'),
});
export type VeridianAIAssistantChatbotInput = z.infer<typeof VeridianAIAssistantChatbotInputSchema>;

// Output Schema for the chatbot's response
const VeridianAIAssistantChatbotOutputSchema = z.object({
  response: z.string().describe('The intelligent, context-aware, and multi-lingual farming advice from the AI assistant.'),
});
export type VeridianAIAssistantChatbotOutput = z.infer<typeof VeridianAIAssistantChatbotOutputSchema>;

export async function veridianAIAssistantChatbot(input: VeridianAIAssistantChatbotInput): Promise<VeridianAIAssistantChatbotOutput> {
  return veridianAIAssistantChatbotFlow(input);
}

const veridianAIAssistantChatbotFlow = ai.defineFlow(
  {
    name: 'veridianAIAssistantChatbotFlow',
    inputSchema: VeridianAIAssistantChatbotInputSchema,
    outputSchema: VeridianAIAssistantChatbotOutputSchema,
  },
  async (input) => {
    const messages: any[] = [
      {
        role: 'system',
        content: [{
          text: `You are an intelligent agriculture chatbot named Veridian Assistant. Your goal is to provide comprehensive and helpful advice to farmers. You can respond in English or Tamil. Current user query: ${input.query}`
        }]
      },
    ];

    if (input.history && input.history.length > 0) {
      messages.push(...input.history);
    }

    messages.push({
      role: 'user',
      content: [{ text: input.query }]
    });

    try {
      const result = await ai.generate({
        messages: messages,
        config: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      });

      if (!result || !result.text) {
        throw new Error('No response from AI model.');
      }

      return { response: result.text };
    } catch (error: any) {
      console.error('Genkit Generate Error:', error);
      
      if (error.message?.includes('API key not valid')) {
        return { 
          response: "Veridian Assistant is currently configuring its neural link (Invalid Gemini API Key). Please ensure the API key in .env is correct for Google AI Studio." 
        };
      }
      
      throw error;
    }
  }
);
