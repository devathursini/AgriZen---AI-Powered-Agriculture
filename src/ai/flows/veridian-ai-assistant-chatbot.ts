'use server';
/**
 * @fileOverview This file implements the Genkit flow for the AgriZen AI Assistant Chatbot.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const VeridianAIAssistantChatbotOutputSchema = z.object({
  response: z.string().describe('The intelligent farming advice from the AI assistant.'),
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
          text: `You are an intelligent agriculture chatbot named AgriZen Assistant. Your goal is to provide comprehensive, calm, and helpful advice to farmers. You can respond in English or Tamil. Your current objective is to assist with the user's specific query: ${input.query}`
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

    let retries = 5;
    let lastError: any;

    while (retries >= 0) {
      try {
        const response = await ai.generate({
          messages: messages,
          config: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        });

        if (!response || !response.text) {
          throw new Error('No response from AI model.');
        }

        return { response: response.text };
      } catch (error: any) {
        lastError = error;
        const errMsg = error.message?.toLowerCase() || "";
        
        const isRateLimit = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('rate limit') || errMsg.includes('exhausted');
        const isOverload = errMsg.includes('503') || errMsg.includes('unavailable') || errMsg.includes('high demand');

        if ((isRateLimit || isOverload) && retries > 0) {
          const attempt = 5 - retries;
          retries--;
          const waitTime = isRateLimit ? 10000 * Math.pow(2, attempt) : 2000;
          
          console.log(`AgriZen Neural Link (Chat): Quota or overload detected. Retrying in ${waitTime}ms... (${retries + 1} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        if (error.message?.includes('API key not valid') || error.message?.includes('400')) {
          return { 
            response: "AgriZen Assistant is currently configuring its neural link (Invalid or restricted API Key). Please ensure the API key in .env is correct." 
          };
        }
        
        throw error;
      }
    }
    throw lastError;
  }
);
