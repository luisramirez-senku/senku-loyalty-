
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import Logo from "@/components/app/shared/logo";


const formSchema = z.object({
    email: z.string().email({
      message: "Por favor, introduce una dirección de correo electrónico válida.",
    }),
    password: z.string().min(1, {
        message: "La contraseña es requerida.",
    }),
  });


export default function CustomerLoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const emailFromParams = searchParams.get('email');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: emailFromParams || "",
          password: "",
        },
      });

    const handleLogin = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            await login(values.email, values.password);
            toast({
              title: "¡Bienvenido de vuelta!",
              description: "Serás redirigido a tus programas.",
            });
            router.push(`/customer/programs?email=${encodeURIComponent(values.email)}`);
          } catch (error: any) {
            console.error('Error de inicio de sesión:', error);
            const errorCode = error.code;
            let errorMessage = "Ocurrió un error. Por favor, inténtalo de nuevo.";
            if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
                errorMessage = "Correo electrónico o contraseña incorrectos.";
            }
            toast({
              variant: "destructive",
              title: "Error de inicio de sesión",
              description: errorMessage,
            });
          } finally {
            setLoading(false);
          }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Link href="/" className="flex items-center gap-4 mb-8">
                <Logo className="h-10 w-10 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Senku Lealtad</h1>
            </Link>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Bienvenido a tus programas de lealtad</CardTitle>
                    <CardDescription className="text-center">
                        Inicia sesión para ver tus puntos y recompensas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo electrónico</FormLabel>
                                <FormControl>
                                <Input
                                    type="email"
                                    placeholder="tu@email.com"
                                    {...field}
                                    disabled={loading}
                                    required
                                />
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
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                    disabled={loading}
                                    required
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Iniciar Sesión
                        </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
             <div className="mt-4 text-sm text-center">
                <p>¿No tienes una cuenta? Contacta a tu negocio local para obtener un enlace de registro.</p>
                <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>
        </div>
    );
}
