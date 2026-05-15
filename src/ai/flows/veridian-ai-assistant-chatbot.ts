'use server';
/**
 * @fileOverview This file implements the Genkit flow for the Veridian AI Assistant Chatbot.
 * It provides an intelligent, context-aware, and multi-lingual chatbot for farmers,
 * offering advice on crop guidance, disease explanations, pest control, and farming tips.
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
          text: `You are an intelligent agriculture chatbot named Veridian Assistant. Your goal is to provide comprehensive and helpful advice to farmers on a wide range of topics including crop guidance, farming tips, fertilizer suggestions, disease explanations, irrigation guidance, pest control advice, weather-based recommendations, smart farming guidance, yield suggestions, and market advice. You are context-aware and can maintain multi-turn conversations. You can respond in English or Tamil, depending on the user's query.`
        }]
      },
    ];

    if (input.history) {
      messages.push(...input.history);
    }

    messages.push({
      role: 'user',
      content: [{ text: input.query }]
    });

    const result = await ai.generate({
      messages: messages,
      config: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    if (!result || !result.text) {
      throw new Error('No text output received from the AI model.');
    }

    return { response: result.text };
  }
);
