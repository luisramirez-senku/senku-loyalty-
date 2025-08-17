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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Check, DollarSign, Percent, Stamp, Star } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  programType: z.enum(["Puntos", "Sellos", "Cashback"], {
    required_error: "Debes seleccionar un tipo de programa.",
  }),
  programName: z.string().min(1, "El nombre del programa es requerido."),
  issuerName: z.string().min(1, "El nombre del emisor es requerido."),
  programDescription: z.string().optional(),
  
  // Program Rules
  pointsPerAmount: z.coerce.number().optional(),
  amountForPoints: z.coerce.number().optional(),
  stampsCount: z.coerce.number().optional(),
  cashbackPercentage: z.coerce.number().optional(),

  // Wallet Pass Fields
  logoText: z.string().optional(),
  foregroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Debe ser un código de color hexadecimal válido.").optional(),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Debe ser un código de color hexadecimal válido.").optional(),
  labelColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Debe ser un código de color hexadecimal válido.").optional(),

  logoImage: z.any().optional(),
  iconImage: z.any().optional(),
  stripImage: z.any().optional(),
  stampIconActiveColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Debe ser un código de color hexadecimal válido.").optional(),
  stampIconInactiveColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Debe ser un código de color hexadecimal válido.").optional(),

  barcodeType: z.string().min(1, "El tipo de código de barras es requerido."),
});

type ProgramType = "Puntos" | "Sellos" | "Cashback";

export default function CreateProgramForm() {
    const [step, setStep] = useState(1);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            programName: "",
            issuerName: "",
            programDescription: "",
            logoText: "",
            foregroundColor: "#ffffff",
            backgroundColor: "#000000",
            labelColor: "#ffffff",
            stampIconActiveColor: "#000000",
            stampIconInactiveColor: "#dddddd",
            barcodeType: "PKBarcodeFormatQR",
        },
      });
    
      function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        toast({
          title: "Programa Creado",
          description: "El nuevo programa de lealtad ha sido creado exitosamente.",
        });
      }

    const programType = form.watch("programType");

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-4">
            <Link href="/admin/programs" passHref>
                <Button variant="outline" size="icon" disabled={step === 1}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Crear Nuevo Programa de Lealtad</h2>
                <p className="text-muted-foreground">
                    Paso {step} de 3: {step === 1 ? 'Modalidad de recompensa' : step === 2 ? 'Información del programa' : 'Diseño del pase'}
                </p>
            </div>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Modalidad de Recompensa</CardTitle>
                            <CardDescription>Elige cómo acumularán valor tus clientes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="programType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                            >
                                            <Label htmlFor="Puntos" className={cn("border-2 rounded-lg p-4 cursor-pointer", field.value === "Puntos" && "border-primary")}>
                                                <RadioGroupItem value="Puntos" id="Puntos" className="sr-only" />
                                                <div className="flex items-center gap-4 mb-2">
                                                    <Star className="h-6 w-6 text-primary"/>
                                                    <span className="text-lg font-semibold">Puntos</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">Los clientes ganan puntos por compras y los canjean por recompensas.</p>
                                            </Label>
                                            <Label htmlFor="Sellos" className={cn("border-2 rounded-lg p-4 cursor-pointer", field.value === "Sellos" && "border-primary")}>
                                                <RadioGroupItem value="Sellos" id="Sellos" className="sr-only" />
                                                <div className="flex items-center gap-4 mb-2">
                                                    <Stamp className="h-6 w-6 text-primary"/>
                                                    <span className="text-lg font-semibold">Tarjeta de Sellos</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">Completa una tarjeta de sellos para obtener un artículo o servicio gratis.</p>
                                            </Label>
                                            <Label htmlFor="Cashback" className={cn("border-2 rounded-lg p-4 cursor-pointer", field.value === "Cashback" && "border-primary")}>
                                                <RadioGroupItem value="Cashback" id="Cashback" className="sr-only" />
                                                <div className="flex items-center gap-4 mb-2">
                                                    <Percent className="h-6 w-6 text-primary"/>
                                                    <span className="text-lg font-semibold">Cashback</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">Los clientes reciben un porcentaje de su gasto de vuelta como crédito.</p>
                                            </Label>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage className="pt-2"/>
                                    </FormItem>
                                )}
                                />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={nextStep} disabled={!programType}>Siguiente</Button>
                        </CardFooter>
                    </Card>
                )}

                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Programa</CardTitle>
                            <CardDescription>Detalles básicos y reglas para tu programa de {programType}.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="programName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nombre del Programa</FormLabel>
                                    <FormControl>
                                        <Input placeholder={`Ej: Recompensas de ${programType}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="issuerName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nombre del Emisor</FormLabel>
                                    <FormControl>
                                        <Input placeholder="El nombre de su empresa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="programDescription"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describa brevemente el programa..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator className="md:col-span-2"/>
                            
                            {programType === 'Puntos' && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="pointsPerAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Puntos ganados</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input type="number" placeholder="10" className="pl-8" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="amountForPoints"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Por cada</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input type="number" placeholder="1" className="pl-8" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormDescription>...de compra.</FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {programType === 'Sellos' && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="stampsCount"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Número de Sellos</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="10" {...field} />
                                            </FormControl>
                                            <FormDescription>Sellos necesarios para completar la tarjeta.</FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div />
                                    <FormField
                                        control={form.control}
                                        name="stampIconActiveColor"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Color del Sello Activo</FormLabel>
                                            <FormControl>
                                                <Input type="color" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="stampIconInactiveColor"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Color del Sello Inactivo</FormLabel>
                                            <FormControl>
                                                <Input type="color" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                             {programType === 'Cashback' && (
                                <FormField
                                    control={form.control}
                                    name="cashbackPercentage"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Porcentaje de Cashback</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input type="number" placeholder="5" className="pl-8" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}


                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={prevStep}>Anterior</Button>
                            <Button onClick={nextStep}>Siguiente</Button>
                        </CardFooter>
                    </Card>
                )}

                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Diseño del Pase de Wallet</CardTitle>
                            <CardDescription>Personalice la apariencia de la tarjeta de lealtad digital en Apple Wallet y Google Wallet.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="logoText"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Texto del Logo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Texto junto a su logo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="backgroundColor"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Color de Fondo</FormLabel>
                                    <FormControl>
                                        <Input type="color" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="foregroundColor"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Color de Texto Principal</FormLabel>
                                    <FormControl>
                                        <Input type="color" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="labelColor"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Color de Etiqueta</FormLabel>
                                    <FormControl>
                                        <Input type="color" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="md:col-span-2 lg:col-span-3 grid md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="logoImage"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Logo</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/png" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormDescription>PNG, requerido (320x320px rec.).</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="iconImage"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Ícono</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/png" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormDescription>PNG, requerido (58x58px rec.).</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stripImage"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Imagen de Banner</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/png" onChange={(e) => field.onChange(e.target.files)} />
                                        </FormControl>
                                        <FormDescription>PNG, opcional (750x288px rec.).</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator className="md:col-span-2 lg:col-span-3" />

                            <FormField
                                control={form.control}
                                name="barcodeType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Formato del Código de Barras</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un formato" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PKBarcodeFormatQR">Código QR</SelectItem>
                                            <SelectItem value="PKBarcodeFormatPDF417">PDF417</SelectItem>
                                            <SelectItem value="PKBarcodeFormatAztec">Aztec</SelectItem>
                                            <SelectItem value="PKBarcodeFormatCode128">Code 128</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={prevStep}>Anterior</Button>
                            <Button type="submit">Crear Programa</Button>
                        </CardFooter>
                    </Card>
                )}
            </form>
        </Form>
    </div>
  );
}

    