
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

const loginSchema = z.object({
    email: z.string().email({
      message: "Por favor, introduce una dirección de correo electrónico válida.",
    }),
    password: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
    }),
  });

const signupSchema = z.object({
  name: z.string().min(2, "El nombre del negocio es requerido."),
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
  const buttonText = mode === "login" ? "Iniciar Sesión" : "Crear Cuenta y Entorno Demo";
  const footerText = mode === "login"
    ? "¿No tienes una cuenta?"
    : "¿Ya tienes una cuenta?";
  const footerLink = mode === "login" ? "/signup" : "/login";
  const footerLinkText = mode === "login" ? "Regístrate" : "Inicia Sesión";

  const form = useForm<z.infer<typeof loginSchema | typeof signupSchema>>({
    resolver: zodResolver(mode === 'login' ? loginSchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === 'signup' && { name: '' }),
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema | typeof signupSchema>) {
    setLoading(true);
    try {
      if (mode === "login") {
        const { email, password } = values as z.infer<typeof loginSchema>;
        await login(email, password);
      } else {
        const { email, password, name } = values as z.infer<typeof signupSchema>;
        await signup(email, password, name);
      }
      toast({
        title: mode === "login" ? "¡Bienvenido de vuelta!" : "¡Entorno Demo Creado!",
        description: "Serás redirigido a tu panel.",
      });
      // Redirect to admin panel after successful login/signup
      router.push("/admin"); 
    } catch (error: any) {
      console.error("Error de autenticación:", error);
      const errorCode = error.code;
      let errorMessage = "Ocurrió un error. Por favor, inténtalo de nuevo.";
      if (errorCode === 'auth/email-already-in-use') {
        errorMessage = "Este correo electrónico ya está registrado. Por favor, inicia sesión.";
      } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
        errorMessage = "Correo electrónico o contraseña incorrectos.";
      }
      toast({
        variant: "destructive",
        title: "Error de autenticación",
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
          <CardTitle className="text-center text-2xl">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             {mode === 'signup' && (
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre del Negocio</FormLabel>
                        <FormControl>
                        <Input placeholder="Ej: Mi Cafetería Favorita" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}
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
                    <div className="flex justify-between items-center">
                      <FormLabel>Contraseña</FormLabel>
                       {mode === 'login' && (
                        <Link
                          href="/forgot-password"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </Link>
                      )}
                    </div>
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
