
"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  generatePersonalizedOffers,
  type GeneratePersonalizedOffersOutput,
} from "@/ai/flows/generate-personalized-offers";
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
import { Loader, Sparkles, Tag, Send } from "lucide-react";
import { customerSegments } from "./customer-management";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"


const formSchema = z.object({
  customerSegment: z.string().min(1, "Se requiere el segmento de clientes."),
  campaignGoal: z.string().min(1, "Se requiere el objetivo de la campaña."),
});

export default function OfferGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<GeneratePersonalizedOffersOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerSegment: "En riesgo",
      campaignGoal: "Reactivar clientes que no han comprado en los últimos 90 días con una oferta de alto valor.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await generatePersonalizedOffers(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron generar las ofertas. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Generador de Campañas de Ofertas
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Definir Campaña</CardTitle>
            <CardDescription>
              Seleccione un segmento y describa el objetivo para generar ideas de ofertas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="customerSegment"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Segmento de Clientes</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar un segmento" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {customerSegments.map(segment => (
                                    <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="campaignGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo de la Campaña</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ej: Premiar a nuestros clientes más leales con un descuento exclusivo."
                          {...field}
                          rows={3}
                        />
                      </FormControl>
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
                  Generar Ideas de Oferta
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="lg:col-span-3">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Ideas de Campaña Sugeridas</CardTitle>
              <CardDescription>
                Ofertas generadas por IA para el segmento y objetivo seleccionados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
              {loading && (
                <div className="flex justify-center items-center py-16">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {result ? (
                result.offers.map((offer, index) => (
                  <Card key={index} className="bg-background/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        {offer.offerName}
                      </CardTitle>
                      <CardDescription>{offer.offerDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground italic">"{offer.promotionalText}"</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center text-sm">
                       <Button size="sm">
                            <Send className="mr-2 h-4 w-4" />
                            Lanzar campaña
                       </Button>
                       <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                         CODE: {offer.discountCode}
                       </span>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                !loading && (
                  <div className="text-center text-muted-foreground py-16">
                    <p>Las ideas de campaña generadas aparecerán aquí.</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
