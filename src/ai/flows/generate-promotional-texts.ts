// use server'
'use server';

/**
 * @fileOverview Generates compelling descriptions and promotional texts for loyalty program offers.
 *
 * - generatePromotionalText - A function that generates promotional texts.
 * - GeneratePromotionalTextInput - The input type for the generatePromotionalText function.
 * - GeneratePromotionalTextOutput - The return type for the generatePromotionalText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePromotionalTextInputSchema = z.object({
  offerName: z.string().describe('The name of the loyalty program offer.'),
  offerDetails: z.string().describe('Detailed information about the offer, including benefits, duration, and any restrictions.'),
  customerSegment: z.string().describe('The target customer segment for this offer.'),
  callToAction: z.string().describe('The desired call to action for the promotion (e.g., Visit our store, Sign up now, Redeem today).'),
  tone: z.string().describe('The desired tone of the promotional text (e.g., Exciting, Informative, Urgency).'),
});
export type GeneratePromotionalTextInput = z.infer<typeof GeneratePromotionalTextInputSchema>;

const GeneratePromotionalTextOutputSchema = z.object({
  promotionalText: z.string().describe('The generated promotional text optimized for customer engagement.'),
});
export type GeneratePromotionalTextOutput = z.infer<typeof GeneratePromotionalTextOutputSchema>;

export async function generatePromotionalText(input: GeneratePromotionalTextInput): Promise<GeneratePromotionalTextOutput> {
  return generatePromotionalTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePromotionalTextPrompt',
  input: {schema: GeneratePromotionalTextInputSchema},
  output: {schema: GeneratePromotionalTextOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in creating engaging promotional content for loyalty programs.

  Based on the details provided, generate a compelling promotional text that will maximize customer engagement and participation.

  Offer Name: {{{offerName}}}
  Offer Details: {{{offerDetails}}}
  Target Customer Segment: {{{customerSegment}}}
  Call to Action: {{{callToAction}}}
  Tone: {{{tone}}}

  Promotional Text:`, 
});

const generatePromotionalTextFlow = ai.defineFlow(
  {
    name: 'generatePromotionalTextFlow',
    inputSchema: GeneratePromotionalTextInputSchema,
    outputSchema: GeneratePromotionalTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
