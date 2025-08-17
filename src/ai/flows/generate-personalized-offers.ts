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
  customerId: z.string().describe('El identificador único para el cliente.'),
  purchaseHistory: z.string().describe('Un resumen de las compras pasadas del cliente.'),
  loyaltyTier: z.string().describe('El nivel actual del programa de lealtad del cliente (por ejemplo, Bronce, Plata, Oro).'),
  pointsBalance: z.number().describe('El saldo actual de puntos de lealtad del cliente.'),
  preferences: z.string().describe('Las preferencias del cliente.'),
});
export type GeneratePersonalizedOffersInput = z.infer<typeof GeneratePersonalizedOffersInputSchema>;

const GeneratePersonalizedOffersOutputSchema = z.object({
  offers: z.array(
    z.object({
      offerName: z.string().describe('El nombre de la oferta personalizada.'),
      offerDescription: z.string().describe('Una descripción detallada de la oferta.'),
      discountCode: z.string().describe('El código de descuento asociado a la oferta.'),
      expirationDate: z.string().describe('La fecha de vencimiento de la oferta (AAAA-MM-DD).'),
    })
  ).describe('Una lista de sugerencias de ofertas personalizadas para el cliente.'),
});
export type GeneratePersonalizedOffersOutput = z.infer<typeof GeneratePersonalizedOffersOutputSchema>;

export async function generatePersonalizedOffers(input: GeneratePersonalizedOffersInput): Promise<GeneratePersonalizedOffersOutput> {
  return generatePersonalizedOffersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedOffersPrompt',
  input: {schema: GeneratePersonalizedOffersInputSchema},
  output: {schema: GeneratePersonalizedOffersOutputSchema},
  prompt: `Eres un experto en programas de lealtad, hábil en la creación de sugerencias de ofertas personalizadas para clientes.

  Basado en la siguiente información sobre el cliente, genera una lista de ofertas atractivas y relevantes:

  ID de cliente: {{{customerId}}}
  Historial de compras: {{{purchaseHistory}}}
  Nivel de lealtad: {{{loyaltyTier}}}
  Saldo de puntos: {{{pointsBalance}}}
  Preferencias: {{{preferences}}}

  Considera su historial de compras, nivel de lealtad, saldo de puntos y preferencias para crear ofertas que los incentiven a realizar compras adicionales y a interactuar más con el programa de lealtad.
  Las ofertas generadas deben ser específicas y atractivas para el cliente individual.
  Asegúrate de generar un código de descuento único para cada oferta.
  Proporciona la fecha de hoy y agrega 30 días para la fecha de vencimiento de cada oferta (AAAA-MM-DD).
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
