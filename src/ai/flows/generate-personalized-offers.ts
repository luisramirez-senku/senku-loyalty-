'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized offer suggestions for loyalty program customers.
 *
 * It includes:
 * - `generatePersonalizedOffers`: An async function that takes customer data and returns personalized offer suggestions.
 * - `GeneratePersonalizedOffersInput`: The input type for the `generatePersonalizedOffers` function.
 * - `GeneratePersonalizedOffersOutput`: The output type for the `generatePersonalizedOffers` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedOffersInputSchema = z.object({
  customerId: z.string().describe('The unique identifier for the customer.'),
  purchaseHistory: z.string().describe('A summary of the customer\'s past purchases.'),
  loyaltyTier: z.string().describe('The customer\'s current loyalty program tier (e.g., Bronze, Silver, Gold).'),
  pointsBalance: z.number().describe('The customer\'s current loyalty points balance.'),
  preferences: z.string().describe('The customer\'s preferences.'),
});
export type GeneratePersonalizedOffersInput = z.infer<typeof GeneratePersonalizedOffersInputSchema>;

const GeneratePersonalizedOffersOutputSchema = z.object({
  offers: z.array(
    z.object({
      offerName: z.string().describe('The name of the personalized offer.'),
      offerDescription: z.string().describe('A detailed description of the offer.'),
      discountCode: z.string().describe('The discount code associated with the offer.'),
      expirationDate: z.string().describe('The expiration date of the offer (YYYY-MM-DD).'),
    })
  ).describe('A list of personalized offer suggestions for the customer.'),
});
export type GeneratePersonalizedOffersOutput = z.infer<typeof GeneratePersonalizedOffersOutputSchema>;

export async function generatePersonalizedOffers(input: GeneratePersonalizedOffersInput): Promise<GeneratePersonalizedOffersOutput> {
  return generatePersonalizedOffersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedOffersPrompt',
  input: {schema: GeneratePersonalizedOffersInputSchema},
  output: {schema: GeneratePersonalizedOffersOutputSchema},
  prompt: `You are a loyalty program expert, skilled at creating personalized offer suggestions for customers.

  Based on the following information about the customer, generate a list of compelling and relevant offers:

  Customer ID: {{{customerId}}}
  Purchase History: {{{purchaseHistory}}}
  Loyalty Tier: {{{loyaltyTier}}}
  Points Balance: {{{pointsBalance}}}
  Preferences: {{{preferences}}}

  Consider their purchase history, loyalty tier, points balance and preferences to create offers that will incentivize them to make additional purchases and engage more with the loyalty program.
  The generated offers should be specific and appealing to the individual customer.
  Make sure to generate a unique discount code for each offer.
  Provide today's date and add 30 days for each offer's expiration date (YYYY-MM-DD).
  `,
});

const generatePersonalizedOffersFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedOffersFlow',
    inputSchema: GeneratePersonalizedOffersInputSchema,
    outputSchema: GeneratePersonalizedOffersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
