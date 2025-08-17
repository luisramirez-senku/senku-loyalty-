
import ProgramDetails from "@/components/app/admin/program-details";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import type { Program } from "@/components/app/admin/program-management";

async function getProgram(programId: string) {
    const docRef = doc(db, "programs", programId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Program;
    } else {
        // En una aplicación real, querrías manejar esto de manera más elegante (p.ej., página 404)
        return null;
    }
}


export default async function ProgramDetailsPage({ params }: { params: { programId: string } }) {
  const program = await getProgram(params.programId);
  
  if (!program) {
    return <div className="p-8">Programa no encontrado.</div>
  }

  return <ProgramDetails program={program} />;
}
