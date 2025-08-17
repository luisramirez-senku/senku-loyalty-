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
  offerName: z.string().describe('El nombre de la oferta del programa de lealtad.'),
  offerDetails: z.string().describe('Información detallada sobre la oferta, incluidos los beneficios, la duración y cualquier restricción.'),
  customerSegment: z.string().describe('El segmento de clientes objetivo para esta oferta.'),
  callToAction: z.string().describe('La llamada a la acción deseada para la promoción (por ejemplo, Visite nuestra tienda, Regístrese ahora, Canjee hoy).'),
  tone: z.string().describe('El tono deseado del texto promocional (por ejemplo, emocionante, informativo, de urgencia).'),
});
export type GeneratePromotionalTextInput = z.infer<typeof GeneratePromotionalTextInputSchema>;

const GeneratePromotionalTextOutputSchema = z.object({
  promotionalText: z.string().describe('El texto promocional generado optimizado para la participación del cliente.'),
});
export type GeneratePromotionalTextOutput = z.infer<typeof GeneratePromotionalTextOutputSchema>;

export async function generatePromotionalText(input: GeneratePromotionalTextInput): Promise<GeneratePromotionalTextOutput> {
  return generatePromotionalTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePromotionalTextPrompt',
  input: {schema: GeneratePromotionalTextInputSchema},
  output: {schema: GeneratePromotionalTextOutputSchema},
  prompt: `Eres un redactor publicitario experto en marketing especializado en la creación de contenido promocional atractivo para programas de lealtad.

  Basado en los detalles proporcionados, genera un texto promocional convincente que maximizará la participación y el compromiso del cliente.

  Nombre de la oferta: {{{offerName}}}
  Detalles de la oferta: {{{offerDetails}}}
  Segmento de clientes objetivo: {{{customerSegment}}}
  Llamada a la acción: {{{callToAction}}}
  Tono: {{{tone}}}

  Texto promocional:`, 
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
