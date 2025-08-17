
"use client";

import { useSearchParams } from 'next/navigation';
import CustomerRegistrationForm from "@/components/app/customer/registration-form";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export default function RegistrationPage({ params }: { params: { programId: string } }) {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenant');
  const [tenantName, setTenantName] = useState("[Nombre del Comercio]");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantName = async () => {
      if (tenantId) {
        try {
          const tenantDoc = await getDoc(doc(db, "tenants", tenantId));
          if (tenantDoc.exists()) {
            setTenantName(tenantDoc.data().name);
          }
        } catch (error) {
          console.error("Error fetching tenant name:", error);
        }
      }
      setLoading(false);
    };
    fetchTenantName();
  }, [tenantId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }
  
  if (!tenantId) {
    return <div className="flex items-center justify-center min-h-screen">URL de registro no válida. Falta el identificador del comercio.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="flex flex-col items-center gap-4 mb-8">
        <Image src="https://placehold.co/100x100.png" alt="Logo del Comercio" width={100} height={100} className="rounded-full" data-ai-hint="logo" />
        <h1 className="text-3xl font-bold tracking-tight text-center">Únete al programa de lealtad de<br/>{tenantName}</h1>
      </div>
      <CustomerRegistrationForm programId={params.programId} tenantId={tenantId} />
    </div>
  );
}
