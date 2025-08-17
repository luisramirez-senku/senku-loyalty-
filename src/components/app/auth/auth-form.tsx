
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
});

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const title = mode === "login" ? "Iniciar Sesión" : "Crear una Cuenta";
  const description = mode === "login"
    ? "Ingresa tus credenciales para acceder a tu panel."
    : "Completa el formulario para registrar un nuevo negocio.";
  const buttonText = mode === "login" ? "Iniciar Sesión" : "Crear Cuenta";
  const footerText = mode === "login"
    ? "¿No tienes una cuenta?"
    : "¿Ya tienes una cuenta?";
  const footerLink = mode === "login" ? "/signup" : "/login";
  const footerLinkText = mode === "login" ? "Regístrate" : "Inicia Sesión";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (mode === "login") {
        await login(values.email, values.password);
      } else {
        await signup(values.email, values.password);
      }
      toast({
        title: mode === "login" ? "¡Bienvenido de vuelta!" : "¡Registro exitoso!",
        description: "Serás redirigido a tu panel.",
      });
      // Redirect to admin panel after successful login/signup
      router.push("/admin"); 
    } catch (error: any) {
      console.error("Error de autenticación:", error);
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: error.message || "Ocurrió un error. Por favor, inténtalo de nuevo.",
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
          <CardTitle className="text-center text-2xl">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {buttonText}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="mt-4 text-sm">
        {footerText}{" "}
        <Link href={footerLink} className="font-semibold text-primary hover:underline">
          {footerLinkText}
        </Link>
      </div>
    </div>
  );
}
