
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import type { Customer } from "@/components/app/admin/customer-management";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Program } from "@/components/app/admin/program-management";

const WALLET_FUNCTION_URL = "https://us-central1-senku-loyalty.cloudfunctions.net/generateWalletPass";

interface LoyaltyCardProps {
    customerId: string;
}

export default function LoyaltyCard({ customerId }: LoyaltyCardProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [passLoading, setPassLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerId) {
          setLoading(false);
          return;
      }
      try {
        // This is a complex query to find the tenant that owns this customer.
        // In a real-world scenario with proper indexing, this can be efficient.
        const tenantsCollection = collection(db, 'tenants');
        const tenantsSnapshot = await getDocs(tenantsCollection);
        let foundCustomer: Customer | null = null;
        let foundTenantId: string | null = null;

        for (const tenantDoc of tenantsSnapshot.docs) {
          const customerRef = doc(db, 'tenants', tenantDoc.id, 'customers', customerId);
          const customerSnap = await getDoc(customerRef);
          if (customerSnap.exists()) {
            foundCustomer = { id: customerSnap.id, ...customerSnap.data() } as Customer;
            foundTenantId = tenantDoc.id;
            break;
          }
        }
        
        if (foundCustomer && foundTenantId) {
          setCustomer(foundCustomer);
          setTenantId(foundTenantId);

          const programId = (foundCustomer as any).programId;
          if (programId) {
            const programRef = doc(db, "tenants", foundTenantId, "programs", programId);
            const programSnap = await getDoc(programRef);
            if (programSnap.exists()) {
              setProgram({ id: programSnap.id, ...programSnap.data() } as Program);
            }
          } else {
             // Fallback program if not specified
             setProgram({ id: 'fallback', name: 'Programa de Lealtad', type: 'Puntos', status: 'Activo', members: 0, created: '' });
          }

        } else {
          console.log("No such customer!");
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [customerId]);

  const handleAddToWallet = async (walletType: 'google' | 'apple') => {
    if (!customer || !program) return;
    setPassLoading(true);

    if (walletType === 'apple') {
        toast({ title: "Próximamente", description: "La integración con Apple Wallet estará disponible pronto."});
        setPassLoading(false);
        return;
    }

    try {
        const response = await fetch(WALLET_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId: customer.id,
                customerName: customer.name,
                customerPoints: customer.points,
                customerTier: customer.tier,
                programName: program.name,
                // Pass tenantId to wallet function if needed for branding etc.
                tenantId: tenantId,
                // Values from program design
                logoText: (program as any).design?.logoText || "Senku Lealtad",
                backgroundColor: (program as any).design?.backgroundColor || "#2962FF",
                foregroundColor: (program as any).design?.foregroundColor || "#FFFFFF",
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.saveUrl) {
            window.open(result.saveUrl, '_blank');
        } else {
             throw new Error("La respuesta del servidor no contenía una URL de guardado.");
        }

    } catch (error) {
        console.error('Error generating wallet pass:', error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo generar el pase de Wallet. Inténtalo de nuevo."
        });
    } finally {
        setPassLoading(false);
    }
  }


  if (loading) {
    return (
        <Card className="overflow-hidden">
            <div className="bg-primary p-6">
                <Skeleton className="h-8 w-1/2 bg-primary-foreground/20" />
                <Skeleton className="h-4 w-1/3 mt-2 bg-primary-foreground/20" />
                <div className="mt-4 flex items-end justify-between">
                     <Skeleton className="h-10 w-1/4 bg-primary-foreground/20" />
                     <Skeleton className="h-12 w-12 bg-primary-foreground/20 rounded-md" />
                </div>
            </div>
             <CardFooter className="bg-background/80 p-4 flex gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
  }

  if (!customer) {
    return (
         <Card>
            <CardHeader>
                <CardTitle>No se pudo cargar la tarjeta</CardTitle>
                <CardDescription>No pudimos encontrar tus datos de lealtad.</CardDescription>
            </CardHeader>
        </Card>
    )
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${customer.id}`;

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary text-primary-foreground p-6 relative">
        <div className="absolute inset-0 bg-grid-slate-100/10 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl">{customer.name}</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                    Miembro de Nivel {customer.tier}
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Image src={qrCodeUrl} alt="QR Code" width={80} height={80} className="rounded-md bg-white p-1" />
            </div>
        </div>
        <div className="relative z-10 mt-4 flex items-end justify-between">
            <div>
                <p className="text-sm text-primary-foreground/80">Saldo de puntos</p>
                <p className="text-4xl font-bold">{customer.points.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-1 text-primary-foreground/80">
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <span>Miembro de {customer.tier}</span>
            </div>
        </div>
      </div>
      <CardFooter className="bg-background/80 backdrop-blur-sm p-4 flex flex-col sm:flex-row gap-2">
        <Button className="w-full" onClick={() => handleAddToWallet('apple')} disabled={passLoading}>
            {passLoading ? <Loader className="mr-2 h-4 w-4 animate-spin"/> : <Image src="/apple-wallet.svg" alt="Apple Wallet" width={24} height={24} className="mr-2" />}
            Añadir a Apple Wallet
        </Button>
        <Button className="w-full" variant="outline" onClick={() => handleAddToWallet('google')} disabled={passLoading}>
            {passLoading ? <Loader className="mr-2 h-4 w-4 animate-spin"/> : <Image src="/google-wallet.svg" alt="Google Wallet" width={24} height={24} className="mr-2" />}
            Añadir a Google Wallet
        </Button>
      </CardFooter>
    </Card>
  );
}
