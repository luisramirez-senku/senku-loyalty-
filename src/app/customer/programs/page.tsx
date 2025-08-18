
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs, collectionGroup, doc, getDoc } from "firebase/firestore";
import type { Customer } from "@/components/app/admin/customer-management";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Star } from "lucide-react";
import Logo from "@/components/app/shared/logo";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";


interface CustomerProgram extends Customer {
    tenantId: string;
    tenantName: string;
    logoUrl: string;
}

export default function CustomerProgramsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [programs, setPrograms] = useState<CustomerProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!email) {
        setLoading(false);
        return;
      }
      try {
        const customersRef = collectionGroup(db, 'customers');
        const q = query(customersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        const customerProgramsData: CustomerProgram[] = [];
        for (const customerDoc of querySnapshot.docs) {
          const customerData = { id: customerDoc.id, ...customerDoc.data() } as Omit<Customer, 'id'> & { id: string };
          const tenantId = customerDoc.ref.parent.parent?.id;
          
          if (tenantId) {
            const tenantRef = doc(db, 'tenants', tenantId);
            const tenantSnap = await getDoc(tenantRef);
            if (tenantSnap.exists()) {
                const tenantData = tenantSnap.data();
                customerProgramsData.push({
                    ...customerData,
                    tenantId: tenantId,
                    tenantName: tenantData.name || "Negocio",
                    logoUrl: tenantData.logoUrl || "https://placehold.co/100x100.png?text=L"
                });
            }
          }
        }
        setPrograms(customerProgramsData);
      } catch (error) {
        console.error("Error fetching customer programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [email]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Link href="/" className="flex items-center gap-4 mb-8">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Senku Lealtad</h1>
        </Link>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Tus Programas de Lealtad</CardTitle>
          <CardDescription>
            Encontramos estas cuentas asociadas a tu correo electrónico. Selecciona una para ver los detalles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
             Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                </div>
            ))
          )}
          {!loading && programs.map((program) => (
            <Card 
                key={program.id} 
                className="hover:bg-accent hover:border-primary cursor-pointer transition-colors"
                onClick={() => router.push(`/customer/${program.id}`)}
            >
                <CardContent className="p-4 flex items-center gap-4">
                    <Image src={program.logoUrl} alt={program.tenantName} width={64} height={64} className="rounded-md" data-ai-hint="logo" />
                    <div className="flex-1">
                        <h3 className="font-semibold">{program.tenantName}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-primary fill-primary" />
                            <span>{program.points.toLocaleString()} puntos</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium">{program.tier}</p>
                </CardContent>
            </Card>
          ))}
           {!loading && programs.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p>No se encontraron programas para el correo: {email}</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
