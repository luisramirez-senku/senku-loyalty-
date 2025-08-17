'use server';

/**
 * @fileOverview Generates compelling push notification texts for loyalty program offers.
 *
 * - generatePromotionalText - A function that generates push notification texts.
 * - GeneratePromotionalTextInput - The input type for the generatePromotionalText function.
 * - GeneratePromotionalTextOutput - The return type for the generatePromotionalText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePromotionalTextInputSchema = z.object({
  offerName: z.string().describe('El título de la notificación push. Debe ser corto y atractivo.'),
  offerDetails: z.string().describe('Información detallada sobre la oferta para que la IA genere el cuerpo de la notificación. Incluir beneficios, duración y cualquier restricción.'),
  customerSegment: z.string().describe('El segmento de clientes objetivo para esta oferta.'),
  tone: z.string().describe('El tono deseado del texto promocional (por ejemplo, emocionante, informativo, de urgencia).'),
});
export type GeneratePromotionalTextInput = z.infer<typeof GeneratePromotionalTextInputSchema>;

const GeneratePromotionalTextOutputSchema = z.object({
  promotionalText: z.object({
    notificationTitle: z.string().describe('El título generado para la notificación push.'),
    notificationBody: z.string().describe('El cuerpo del mensaje de la notificación push, optimizado para la participación del cliente. Debe ser conciso y claro.'),
  })
});
export type GeneratePromotionalTextOutput = z.infer<typeof GeneratePromotionalTextOutputSchema>;

export async function generatePromotionalText(input: GeneratePromotionalTextInput): Promise<GeneratePromotionalTextOutput> {
  return generatePromotionalTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePromotionalTextPrompt',
  input: {schema: GeneratePromotionalTextInputSchema},
  output: {schema: GeneratePromotionalTextOutputSchema},
  prompt: `Eres un redactor publicitario experto en marketing especializado en la creación de notificaciones push atractivas para programas de lealtad.

  Tu tarea es generar el título y el cuerpo de una notificación push. El título ya está proporcionado. Debes crear un cuerpo de notificación conciso y convincente basado en los detalles de la oferta.

  Título de la Notificación: {{{offerName}}}
  Detalles de la oferta (para tu contexto): {{{offerDetails}}}
  Segmento de clientes objetivo: {{{customerSegment}}}
  Tono: {{{tone}}}

  Genera el cuerpo de la notificación. Debe ser corto (idealmente menos de 150 caracteres), claro y diseñado para maximizar el engagement. El título de la notificación debe ser el mismo que se proporciona en la entrada.
  `, 
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
