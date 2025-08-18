
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs, collectionGroup, doc, getDoc } from "firebase/firestore";
import type { Customer } from "@/components/app/admin/customer-management";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface CustomerProgram extends Customer {
    tenantId: string;
    tenantName: string;
    logoUrl: string;
}

function ProgramsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [programs, setPrograms] = useState<CustomerProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");

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
        
        if (querySnapshot.empty) {
            // Handle case where no customer is found, maybe redirect or show message
            router.push('/login');
            return;
        }

        // Set customer name from the first result
        setCustomerName(querySnapshot.docs[0].data().name);
        
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
  }, [email, router]);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-5 w-1/2 mb-8" />
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase mb-2 text-center">Hola {customerName}</h1>
        <p className="text-muted-foreground mb-8">Estás registrado en los siguientes programas</p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
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
                </CardContent>
            </Card>
          ))}
           {!loading && programs.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-10">
                    <p>No se encontraron programas para el correo: {email}</p>
                    <Button variant="link" onClick={() => router.push('/login')}>Volver</Button>
                </div>
            )}
       </div>
    </div>
  );
}


export default function CustomerProgramsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProgramsContent />
        </Suspense>
    )
}
