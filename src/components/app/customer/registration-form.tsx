
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
import { createNewCustomer } from "@/lib/firebase/actions";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce una dirección de correo electrónico válida.",
  }),
  password: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
  }),
  phone: z.string().optional(),
  cedula: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones.",
  }),
});

interface CustomerRegistrationFormProps {
    programId: string;
    tenantId: string;
}

export default function CustomerRegistrationForm({ programId, tenantId }: CustomerRegistrationFormProps) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      cedula: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
        await createNewCustomer(tenantId, programId, values);
        
        toast({
            title: "¡Registro exitoso!",
            description: "Bienvenido al programa de lealtad. Ahora puedes iniciar sesión.",
        });
        setSubmitted(true);
    } catch (error: any) {
        console.error("Error al registrar el cliente:", error);
        let errorMessage = "No se pudo completar el registro. Por favor, inténtalo de nuevo.";
        if (error.message.includes('email-already-in-use')) {
            errorMessage = "Este correo electrónico ya está registrado. Intenta iniciar sesión.";
        }
        toast({
            variant: "destructive",
            title: "Error en el registro",
            description: errorMessage,
        });
    } finally {
        setLoading(false);
    }
  }

  if (submitted) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center text-2xl">¡Gracias por registrarte!</CardTitle>
                <CardDescription className="text-center">
                    Tu cuenta ha sido creada. Ahora puedes iniciar sesión para ver tus programas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/customer/find" passHref>
                    <Button className="w-full">
                        Ir a Iniciar Sesión
                    </Button>
                </Link>
            </CardContent>
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
                    <Input type="email" placeholder="Ej: tu@correo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
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
