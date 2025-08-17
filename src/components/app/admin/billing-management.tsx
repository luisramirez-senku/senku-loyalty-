
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";


type Plan = "Esencial" | "Crecimiento" | "Empresarial";
type TenantStatus = "Prueba" | "Activo" | "Cancelado";

interface Tenant {
  name: string;
  plan: Plan;
  status: TenantStatus;
  trialEnds?: Date;
}

const pricingPlans = [
    {
        name: "Esencial" as Plan,
        price: "$29",
        priceMonthly: true,
        description: "Para pequeños negocios que empiezan.",
        features: [
            "1 Programa de Lealtad",
            "1 Sucursal",
            "Tarjetas Digitales Ilimitadas",
            "Segmentación de Clientes",
            "Funcionalidades de IA",
            "Soporte por correo electrónico"
        ],
        cta: "Bajar a Esencial"
    },
    {
        name: "Crecimiento" as Plan,
        price: "$79",
        priceMonthly: true,
        description: "Para negocios en expansión.",
        features: [
            "5 Programas de Lealtad",
            "Hasta 5 Sucursales",
            "Tarjetas Digitales Ilimitadas",
            "Segmentación de Clientes",
            "Funcionalidades de IA",
            "Soporte prioritario"
        ],
        cta: "Subir a Crecimiento"
    },
    {
        name: "Empresarial" as Plan,
        price: "Contacto",
        priceMonthly: false,
        description: "Para grandes empresas y franquicias.",
        features: [
            "Programas Ilimitados",
            "Sucursales Ilimitadas",
            "Panel de Super Admin",
            "Marca Blanca Personalizada",
            "Soporte Dedicado 24/7",
            "Acceso a la API"
        ],
        cta: "Contactar Ventas"
    }
]

// Replace with your actual PayPal Subscription Plan IDs
const paypalPlanIds: Record<Plan, string> = {
    Esencial: "P-YOUR-ESSENTIAL-PLAN-ID",
    Crecimiento: "P-YOUR-GROWTH-PLAN-ID",
    Empresarial: "P-YOUR-ENTERPRISE-PLAN-ID",
};


export default function BillingManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  useEffect(() => {
    const fetchTenantData = async () => {
      if (!user) return;
      try {
        const tenantRef = doc(db, "tenants", user.uid);
        const tenantSnap = await getDoc(tenantRef);
        if (tenantSnap.exists()) {
          const data = tenantSnap.data();
          const tenantData: Tenant = {
            name: data.name,
            plan: data.plan,
            status: data.status,
            trialEnds: data.trialEnds?.toDate(),
          };
          setTenant(tenantData);

          if (tenantData.status === "Prueba" && tenantData.trialEnds) {
            const today = new Date();
            const diffTime = tenantData.trialEnds.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysLeft(diffDays > 0 ? diffDays : 0);
          }
        }
      } catch (error) {
        console.error("Error fetching tenant data:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos de tu plan." });
      } finally {
        setLoading(false);
      }
    };
    fetchTenantData();
  }, [user, toast]);

  const handleChangePlan = async (newPlan: Plan) => {
    if (!user || !tenant || newPlan === tenant.plan) return;

    if (newPlan === "Empresarial") {
        toast({ title: "Plan Empresarial", description: "Por favor, contáctanos para configurar un plan a tu medida." });
        return;
    }
    setSelectedPlan(newPlan);
  }

  const handleSubscriptionSuccess = async (newPlan: Plan) => {
    if (!user || !tenant) return;
    setIsUpdating(true);
    try {
        const tenantRef = doc(db, "tenants", user.uid);
        // If user was in trial, their status is now active
        await updateDoc(tenantRef, { plan: newPlan, status: "Activo" });
        setTenant({ ...tenant, plan: newPlan, status: "Activo" });
        setSelectedPlan(null); // Hide PayPal buttons
        toast({ title: "¡Suscripción exitosa!", description: `Has cambiado al plan ${newPlan}.` });
    } catch (error) {
        console.error("Error updating plan:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar tu plan." });
    } finally {
        setIsUpdating(false);
    }
  }

  const PayPalButtonsWrapper = ({ newPlan }: { newPlan: Plan }) => {
    const createSubscription = (data: any, actions: any) => {
        const planId = paypalPlanIds[newPlan];
        
        const subscriptionDetails: any = {
            plan_id: planId,
        };

        if (tenant?.status === 'Prueba' && daysLeft && daysLeft > 0) {
           subscriptionDetails.plan = {
                billing_info: {
                    outstanding_balance: {
                        value: "0",
                        currency_code: "USD"
                    }
                },
                payment_preferences: {
                    auto_bill_outstanding: true,
                },
                trial_period: {
                    tenure_type: "DAY",
                    interval_count: 14
                }
            };
        }

        return actions.subscription.create(subscriptionDetails);
    };

    const onApprove = async (data: any, actions: any) => {
        toast({ title: "Procesando suscripción...", description: "Por favor espera." });
        // The subscription is approved, now update the app's database
        await handleSubscriptionSuccess(newPlan);
    };
    
    const onError = (err: any) => {
        console.error("Error en la suscripción de PayPal:", err);
        toast({
            variant: "destructive",
            title: "Error de suscripción",
            description: "No se pudo completar la suscripción. Por favor, inténtalo de nuevo o contacta con soporte.",
        });
    }

    if (!paypalClientId || paypalClientId === "YOUR_PAYPAL_CLIENT_ID") {
        return <p className="text-destructive text-sm mt-4">La integración de PayPal no está configurada. Por favor, añade tu Client ID de PayPal en el archivo .env.</p>
    }

    return (
        <div className="mt-4 animate-in fade-in-50">
            <PayPalScriptProvider options={{ clientId: paypalClientId, intent: "subscription", vault: true }}>
                <PayPalButtons
                    key={newPlan}
                    createSubscription={createSubscription}
                    onApprove={onApprove}
                    onError={onError}
                    style={{ layout: 'vertical', label: 'subscribe' }}
                />
            </PayPalScriptProvider>
        </div>
    );
};


  if (loading) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-1/3" />
                </CardContent>
            </Card>
            <div className="grid md:grid-cols-3 gap-8 items-start">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="min-h-[140px]">
                            <Skeleton className="h-7 w-1/2" />
                            <Skeleton className="h-10 w-1/3" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-11 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Plan y Facturación</h2>
        <p className="text-muted-foreground">
          Administra tu suscripción y ve tu información de facturación.
        </p>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Tu Plan Actual</CardTitle>
            <CardDescription>
                {tenant?.status === "Prueba" 
                    ? `Estás en una prueba del plan ${tenant?.plan}.`
                    : `Actualmente estás en el plan ${tenant?.plan}.`
                }
            </CardDescription>
        </CardHeader>
        <CardContent>
            {daysLeft !== null && (
                <p className="text-sm font-semibold text-primary">
                    <Rocket className="inline-block h-4 w-4 mr-2" />
                    Te quedan {daysLeft} días de prueba.
                </p>
            )}
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start pt-6">
        {pricingPlans.map((plan) => (
            <Card key={plan.name} className={cn(`flex flex-col`, tenant?.plan === plan.name ? 'border-primary ring-2 ring-primary' : '')}>
                <CardHeader className="min-h-[160px]">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="flex items-baseline gap-2 pt-2">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.priceMonthly && <span className="text-muted-foreground">/ mes</span>}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
                <CardFooter className="flex-col items-start w-full">
                    {tenant?.plan === plan.name ? (
                        <Button className="w-full" size="lg" disabled>
                            Plan Actual
                        </Button>
                    ) : (
                        <Button className="w-full" size="lg" variant="outline" onClick={() => handleChangePlan(plan.name)} disabled={isUpdating}>
                            {isUpdating ? <Loader className="mr-2 h-4 w-4 animate-spin"/> : null}
                            {plan.cta}
                        </Button>
                    )}
                    {selectedPlan === plan.name && (
                        <PayPalButtonsWrapper newPlan={plan.name} />
                    )}
                </CardFooter>
            </Card>
        ))}
        </div>

    </div>
  );
}
