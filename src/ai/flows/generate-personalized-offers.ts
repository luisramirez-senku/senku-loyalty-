'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized offer campaigns for customer segments.
 *
 * It includes:
 * - `generatePersonalizedOffers`: An async function that takes a customer segment and campaign goal and returns offer suggestions.
 * - `GeneratePersonalizedOffersInput`: The input type for the `generatePersonalizedOffers` function.
 * - `GeneratePersonalizedOffersOutput`: The output type for the `generatePersonalizedOffers` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedOffersInputSchema = z.object({
  customerSegment: z.string().describe('El segmento de clientes al que se dirige la campaña (por ejemplo, Clientes en riesgo, Miembros VIP).'),
  campaignGoal: z.string().describe('El objetivo principal de la campaña de ofertas (por ejemplo, Reactivar clientes, Premiar la lealtad).'),
});
export type GeneratePersonalizedOffersInput = z.infer<typeof GeneratePersonalizedOffersInputSchema>;

const GeneratePersonalizedOffersOutputSchema = z.object({
  offers: z.array(
    z.object({
      offerName: z.string().describe('El nombre de la oferta o campaña.'),
      offerDescription: z.string().describe('Una descripción detallada de la oferta, explicando el beneficio para el cliente.'),
      promotionalText: z.string().describe('Un texto promocional corto y atractivo para usar en notificaciones o correos electrónicos.'),
      discountCode: z.string().describe('Un código de descuento de ejemplo asociado a la oferta.'),
    })
  ).describe('Una lista de sugerencias de ofertas y campañas personalizadas para el segmento de clientes.'),
});
export type GeneratePersonalizedOffersOutput = z.infer<typeof GeneratePersonalizedOffersOutputSchema>;

export async function generatePersonalizedOffers(input: GeneratePersonalizedOffersInput): Promise<GeneratePersonalizedOffersOutput> {
  return generatePersonalizedOffersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedOffersPrompt',
  input: {schema: GeneratePersonalizedOffersInputSchema},
  output: {schema: GeneratePersonalizedOffersOutputSchema},
  prompt: `Eres un experto en marketing y programas de lealtad, hábil en la creación de campañas de ofertas para segmentos de clientes específicos.

  Basado en el siguiente segmento de clientes y objetivo de la campaña, genera una lista de 3 ideas de ofertas creativas y relevantes.

  Segmento de Clientes: {{{customerSegment}}}
  Objetivo de la Campaña: {{{campaignGoal}}}

  Para cada idea, proporciona:
  1. Un nombre de oferta atractivo.
  2. Una descripción clara de los beneficios para el cliente.
  3. Un texto promocional corto y convincente.
  4. Un código de descuento de ejemplo.

  Asegúrate de que las ofertas estén alineadas con el objetivo y sean atractivas para el segmento de clientes especificado.
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
