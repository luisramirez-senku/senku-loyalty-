
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import Link from "next/link";
import Logo from "../shared/logo";

const formSchema = z.object({
    email: z.string().email({
      message: "Por favor, introduce una dirección de correo electrónico válida.",
    }),
});

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { sendPasswordReset } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setSubmitted(false);
    try {
      await sendPasswordReset(values.email);
      setSubmitted(true);
    } catch (error: any) {
      console.error("Error al enviar el correo:", error);
      let errorMessage = "Ocurrió un error. Por favor, inténtalo de nuevo.";
      if (error.code === 'auth/user-not-found') {
        // To prevent email enumeration, we show a generic success message even if the user is not found.
         setSubmitted(true);
         return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="flex items-center gap-4 mb-8">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Senku Lealtad</h1>
        </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Restablecer Contraseña</CardTitle>
          {submitted ? (
             <CardDescription className="text-center pt-2">
                Si existe una cuenta con ese correo electrónico, hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.
            </CardDescription>
          ) : (
            <CardDescription className="text-center">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!submitted && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="tu@negocio.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar enlace
                </Button>
                </form>
            </Form>
          )}
        </CardContent>
      </Card>
       <div className="mt-4 text-sm">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Volver a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
