
"use client";

import { useEffect, useState } from "react";
import ProgramDetails from "@/components/app/admin/program-details";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import type { Program } from "@/components/app/admin/program-management";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";


export default function ProgramDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const programId = params.programId as string;
  
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProgram = async () => {
        if (!user || !programId) {
            setLoading(false);
            return;
        }
        try {
            const docRef = doc(db, "tenants", user.uid, "programs", programId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProgram({ id: docSnap.id, ...docSnap.data() } as Program);
            }
        } catch (error) {
            console.error("Error fetching program:", error);
        } finally {
            setLoading(false);
        }
    }
    getProgram();
  }, [user, programId]);
  
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!program) {
    return <div className="p-8">Programa no encontrado.</div>
  }

  return <ProgramDetails program={program} />;
}
