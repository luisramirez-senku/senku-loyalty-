
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { customerSegments } from "./customer-management";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { generatePersonalizedOffers, GeneratePersonalizedOffersOutput } from "@/ai/flows/generate-personalized-offers";
import { Loader, Sparkles, Tag, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  automationName: z.string().min(1, "El nombre de la automatización es requerido."),
  triggerType: z.string().min(1, "Se requiere el tipo de disparador."),
  triggerValue: z.string().min(1, "Se requiere el valor del disparador."),
  actionType: z.string().min(1, "Se requiere el tipo de acción."),
  offerCampaignGoal: z.string().optional(),
  selectedOffer: z.string().optional(),
});

interface CreateAutomationSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function CreateAutomationSheet({ isOpen, setIsOpen }: CreateAutomationSheetProps) {
  const [loading, setLoading] = useState(false);
  const [offerResult, setOfferResult] = useState<GeneratePersonalizedOffersOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      automationName: "",
      triggerType: "customer_segment",
      triggerValue: "",
      actionType: "send_push_notification",
      offerCampaignGoal: "",
    },
  });

  const triggerType = form.watch("triggerType");
  const triggerValue = form.watch("triggerValue");
  const selectedOffer = form.watch("selectedOffer");

  async function handleGenerateOffers() {
    const goal = form.getValues("offerCampaignGoal");
    if (!triggerValue || !goal) {
        toast({
            variant: "destructive",
            title: "Faltan datos",
            description: "Por favor, seleccione un segmento y describa el objetivo de la campaña.",
        });
        return;
    }
    setLoading(true);
    setOfferResult(null);
    try {
      const output = await generatePersonalizedOffers({
        customerSegment: triggerValue,
        campaignGoal: goal,
      });
      setOfferResult(output);
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Automatización Creada",
      description: "El nuevo flujo de trabajo ha sido creado exitosamente.",
    });
    setIsOpen(false);
    form.reset();
    setOfferResult(null);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Crear Nueva Automatización</SheetTitle>
          <SheetDescription>
            Configure un flujo de trabajo que se ejecute cuando se cumplan ciertas condiciones.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-6 pl-1 -ml-1 space-y-6">
                <FormField
                control={form.control}
                name="automationName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre de la Automatización</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Campaña de bienvenida" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <Separator />
                
                <h3 className="font-semibold text-lg">Disparador (Cuándo)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="triggerType"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de Disparador</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Seleccionar un disparador" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="customer_segment">El cliente entra en el segmento</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                {triggerType === 'customer_segment' && (
                    <FormField
                        control={form.control}
                        name="triggerValue"
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
                                {customerSegments.map((segment) => (
                                <SelectItem key={segment} value={segment}>
                                    {segment}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                )}
                </div>

                <Separator />

                <h3 className="font-semibold text-lg">Acción (Qué)</h3>
                 <FormField
                    control={form.control}
                    name="actionType"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de Acción</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Seleccionar una acción" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="send_push_notification">Enviar notificación push con oferta</SelectItem>
                            <SelectItem value="send_email">Enviar correo electrónico con oferta</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                  control={form.control}
                  name="offerCampaignGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo de la Campaña de Ofertas</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describa el objetivo para que la IA genere ideas de ofertas relevantes para el segmento seleccionado."
                          {...field}
                          rows={2}
                          disabled={!triggerValue}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={handleGenerateOffers} disabled={loading || !triggerValue} className="w-full">
                  {loading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generar Ofertas con IA
                </Button>
                
                {offerResult && (
                    <FormField
                        control={form.control}
                        name="selectedOffer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Seleccionar Oferta</FormLabel>
                                <FormControl>
                                    <div className="space-y-2">
                                        {offerResult.offers.map((offer, index) => (
                                            <Card key={index} 
                                                className={`cursor-pointer ${selectedOffer === offer.offerName ? 'border-primary ring-2 ring-primary' : ''}`}
                                                onClick={() => field.onChange(offer.offerName)}
                                            >
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base flex items-center gap-2">
                                                        <Tag className="h-4 w-4 text-primary" />
                                                        {offer.offerName}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">{offer.promotionalText}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

            </div>
            <SheetFooter className="pt-4 border-t">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </SheetClose>
              <Button type="submit" disabled={!selectedOffer}>Crear Automatización</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
