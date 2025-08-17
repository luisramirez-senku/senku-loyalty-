"use client";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  programName: z.string().min(1, "El nombre del programa es requerido."),
  programType: z.string().min(1, "El tipo de programa es requerido."),
  issuerName: z.string().min(1, "El nombre del emisor es requerido."),
  programDescription: z.string().optional(),
  
  // Wallet Pass Fields
  logoText: z.string().optional(),
  foregroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Debe ser un código de color hexadecimal válido.").optional(),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Debe ser un código de color hexadecimal válido.").optional(),
  labelColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Debe ser un código de color hexadecimal válido.").optional(),

  logoImage: z.any().optional(),
  iconImage: z.any().optional(),
  stripImage: z.any().optional(),

  barcodeType: z.string().min(1, "El tipo de código de barras es requerido."),
});

export default function CreateProgramForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            programName: "",
            programType: "Puntos",
            issuerName: "",
            programDescription: "",
            logoText: "",
            foregroundColor: "#ffffff",
            backgroundColor: "#000000",
            labelColor: "#ffffff",
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-4">
            <Link href="/admin/programs" passHref>
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Crear Nuevo Programa de Lealtad</h2>
                <p className="text-muted-foreground">
                    Complete los detalles a continuación para lanzar un nuevo programa.
                </p>
            </div>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Programa</CardTitle>
                        <CardDescription>Detalles básicos sobre su nuevo programa de lealtad.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <FormField
                        control={form.control}
                        name="programName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nombre del Programa</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Recompensas Premium" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="programType"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tipo de Programa</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tipo" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Puntos">Puntos</SelectItem>
                                        <SelectItem value="Sellos">Tarjeta de Sellos</SelectItem>
                                        <SelectItem value="Cashback">Cashback</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                <FormDescription>Este es el nombre que se mostrará en el pase.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="programDescription"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describa brevemente el programa..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

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
                    <CardFooter className="flex justify-end">
                        <Button type="submit">Crear Programa</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>
  );
}
