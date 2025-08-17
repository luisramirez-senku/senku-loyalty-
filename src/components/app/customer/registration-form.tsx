
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce una dirección de correo electrónico válida.",
  }),
  phone: z.string().optional(),
  cedula: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones.",
  }),
});

export default function CustomerRegistrationForm({ programId }: { programId: string }) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cedula: "",
      terms: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log("Formulario de registro enviado:", { ...values, programId });
    
    // Simulate API call
    setTimeout(() => {
        toast({
            title: "¡Registro exitoso!",
            description: "Bienvenido al programa de lealtad.",
        });
        setLoading(false);
        setSubmitted(true);
    }, 1500);
  }

  if (submitted) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center text-2xl">¡Gracias por registrarte!</CardTitle>
                <CardDescription className="text-center">
                Tu tarjeta digital está lista. Agrégala a tu billetera para un fácil acceso.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button className="w-full h-12">
                    <Image src="/apple-wallet.svg" alt="Apple Wallet" width={24} height={24} className="mr-2" />
                    Añadir a Apple Wallet
                </Button>
                <Button className="w-full h-12" variant="outline">
                    <Image src="/google-wallet.svg" alt="Google Wallet" width={24} height={24} className="mr-2" />
                    Añadir a Google Wallet
                </Button>
            </CardContent>
            <CardFooter className="text-center flex-col gap-4">
                <p className="text-xs text-muted-foreground">También recibirás tu tarjeta por correo electrónico.</p>
                 <Link href="/" passHref>
                    <Button variant="link">Volver al inicio</Button>
                </Link>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Únete a nuestro programa</CardTitle>
        <CardDescription className="text-center">
          Completa tus datos para empezar a ganar recompensas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: tu@correo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de teléfono (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 555-123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cedula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cédula (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 1-1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Acepto los términos y condiciones
                    </FormLabel>
                    <FormDescription>
                      Al registrarte, aceptas recibir comunicaciones del programa.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Registrarme
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
