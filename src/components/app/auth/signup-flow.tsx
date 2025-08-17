
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
import { useToast } from "@/hooks/use-toast";
import { Loader, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Logo from "../shared/logo";
import { Textarea } from "@/components/ui/textarea";

const signupSchema = z.object({
  // Step 1
  businessName: z.string().min(2, "El nombre del negocio es requerido."),
  adminEmail: z.string().email("Correo electrónico no válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  
  // Step 2
  industry: z.string().min(1, "La industria es requerida."),
  businessSize: z.string().min(1, "El tamaño del negocio es requerido."),
  goals: z.string().optional(),

  // Step 3
  billingAddress: z.string().min(1, "La dirección de facturación es requerida."),
  city: z.string().min(1, "La ciudad es requerida."),
  country: z.string().min(1, "El país es requerido."),
  taxId: z.string().optional(),
});

export default function SignupFlow() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
        businessName: "",
        adminEmail: "",
        password: "",
        industry: "",
        businessSize: "",
        goals: "",
        billingAddress: "",
        city: "",
        country: "",
        taxId: "",
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof signupSchema>)[] = [];
    if (step === 1) {
      fieldsToValidate = ["businessName", "adminEmail", "password"];
    } else if (step === 2) {
      fieldsToValidate = ["industry", "businessSize"];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => setStep((s) => s - 1);


  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setLoading(true);
    try {
        // We pass all the collected data to the signup function
      await signup(values.adminEmail, values.password, values.businessName, values);
      toast({
        title: "¡Cuenta Creada!",
        description: "Tu nuevo entorno está listo. Serás redirigido a tu panel.",
      });
      router.push("/admin"); 
    } catch (error: any) {
      console.error("Error de registro:", error);
      const errorCode = error.code;
      let errorMessage = "Ocurrió un error. Por favor, inténtalo de nuevo.";
      if (errorCode === 'auth/email-already-in-use') {
        errorMessage = "Este correo electrónico ya está registrado. Por favor, inicia sesión.";
        setStep(1); // Go back to the first step if email is the issue
      }
      toast({
        variant: "destructive",
        title: "Error de registro",
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
      <Card className="w-full max-w-lg">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        {step > 1 && (
                            <Button type="button" variant="outline" size="icon" onClick={prevStep}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <div>
                            <CardTitle className="text-2xl">Crear una Cuenta</CardTitle>
                            <CardDescription>
                                Paso {step} de 3: {step === 1 ? 'Información de la Cuenta' : step === 2 ? 'Detalles del Negocio' : 'Información de Facturación'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Step 1: Account Info */}
                    <div className={step === 1 ? "block" : "hidden"}>
                        <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="businessName"
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
                        <FormField
                            control={form.control}
                            name="adminEmail"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tu Correo Electrónico (Admin)</FormLabel>
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
                        </div>
                    </div>

                    {/* Step 2: Business Details */}
                    <div className={step === 2 ? "block" : "hidden"}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="industry"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>¿En qué industria operas?</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una industria" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Cafeteria">Cafetería / Restaurante</SelectItem>
                                        <SelectItem value="Retail">Retail / Tienda</SelectItem>
                                        <SelectItem value="Servicios">Servicios (Peluquería, Spa, etc.)</SelectItem>
                                        <SelectItem value="Entretenimiento">Entretenimiento</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="businessSize"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>¿Cuántos empleados tiene tu negocio?</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el tamaño" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1-10">1-10</SelectItem>
                                        <SelectItem value="11-50">11-50</SelectItem>
                                        <SelectItem value="51-200">51-200</SelectItem>
                                        <SelectItem value="201+">Más de 201</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="goals"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>¿Qué esperas lograr con Senku Lealtad? (Opcional)</FormLabel>
                                    <FormControl>
                                    <Textarea
                                        placeholder="Ej: Aumentar la retención de clientes, incrementar la frecuencia de compra, etc."
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Step 3: Billing Info */}
                    <div className={step === 3 ? "block" : "hidden"}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="billingAddress"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección de Facturación</FormLabel>
                                    <FormControl>
                                    <Input placeholder="123 Calle Principal" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ciudad</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Tu ciudad" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>País</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Tu país" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                             <FormField
                                control={form.control}
                                name="taxId"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ID Fiscal / NIT (Opcional)</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Tu número de identificación fiscal" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    {step < 3 && (
                        <Button type="button" onClick={nextStep} className="w-full">
                            Siguiente
                        </Button>
                    )}
                    {step === 3 && (
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Registrarse
                        </Button>
                    )}
                </CardFooter>
            </form>
        </Form>
      </Card>
      <div className="mt-4 text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Inicia Sesión
        </Link>
      </div>
    </div>
  );
}
