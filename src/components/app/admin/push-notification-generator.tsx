"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  generatePromotionalText,
  type GeneratePromotionalTextOutput,
} from "@/ai/flows/generate-promotional-texts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader, Sparkles, Clipboard, Check, Send } from "lucide-react";

const formSchema = z.object({
    offerName: z.string().min(1, "Se requiere el nombre de la oferta."),
    offerDetails: z.string().min(1, "Se requieren los detalles de la oferta."),
    customerSegment: z.string().min(1, "Se requiere el segmento de clientes."),
    callToAction: z.string().optional(),
    tone: z.string().min(1, "Se requiere el tono."),
});

export default function PushNotificationGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<GeneratePromotionalTextOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        offerName: "Martes de puntos dobles",
        offerDetails: "Gana el doble de puntos de lealtad en todas las compras realizadas los martes durante todo el mes de julio.",
        customerSegment: "Todos los miembros de lealtad",
        callToAction: "Comprar ahora",
        tone: "Emocionante",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await generatePromotionalText(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo generar el texto. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (result) {
        navigator.clipboard.writeText(result.promotionalText.notificationBody);
        setCopied(true);
        toast({ title: "¡Copiado al portapapeles!" });
        setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Generador de Notificaciones Push
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Información de la oferta</CardTitle>
            <CardDescription>
              Describa la promoción para generar un texto atractivo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="offerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título de la Notificación</FormLabel>
                      <FormControl>
                        <Input placeholder="p.ej., Especial de fin de semana" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="offerDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detalles para la IA</FormLabel>
                       <FormControl>
                        <Textarea
                          placeholder="p.ej., Obtenga un 20% de descuento en todos los pasteles..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Proporcione contexto para que la IA genere un buen cuerpo de notificación.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="customerSegment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segmento de clientes</FormLabel>
                      <FormControl>
                        <Input placeholder="p.ej., Nuevos clientes, miembros VIP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tono</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un tono" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Exciting">Emocionante</SelectItem>
                                <SelectItem value="Informative">Informativo</SelectItem>
                                <SelectItem value="Urgency">Urgencia</SelectItem>
                                <SelectItem value="Friendly">Amistoso</SelectItem>
                                <SelectItem value="Professional">Profesional</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generar notificación
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="lg:col-span-3">
          <Card className="sticky top-20">
            <CardHeader>
                <div>
                    <CardTitle>Notificación Push Generada</CardTitle>
                    <CardDescription>
                        Vista previa de cómo se verá la notificación en un dispositivo.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 min-h-[300px] flex items-center justify-center">
              {loading && (
                <div className="flex justify-center items-center h-full">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {result ? (
                <div className="w-full max-w-sm rounded-xl bg-background/50 border p-4 shadow-md">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-primary"/>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm">{result.promotionalText.notificationTitle}</h3>
                            <p className="text-sm text-muted-foreground">{result.promotionalText.notificationBody}</p>
                        </div>
                    </div>
                </div>
              ) : (
                !loading && (
                  <div className="flex justify-center items-center h-full text-center text-muted-foreground">
                    <p>La notificación generada aparecerá aquí.</p>
                  </div>
                )
              )}
            </CardContent>
            {result && (
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Notificación
                    </Button>
                     <Button variant="outline" size="sm" onClick={handleCopy} disabled={copied}>
                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
                        {copied ? "Copiado" : "Copiar Texto"}
                    </Button>
                </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
