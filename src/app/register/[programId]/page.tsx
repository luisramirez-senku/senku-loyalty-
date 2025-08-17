import CustomerRegistrationForm from "@/components/app/customer/registration-form";
import Image from "next/image";

export default function RegistrationPage({ params }: { params: { programId: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="flex flex-col items-center gap-4 mb-8">
        <Image src="https://placehold.co/100x100.png" alt="Logo del Comercio" width={100} height={100} className="rounded-full" data-ai-hint="logo" />
        <h1 className="text-3xl font-bold tracking-tight text-center">Únete al programa de lealtad de<br/>[Nombre del Comercio]</h1>
      </div>
      <CustomerRegistrationForm programId={params.programId} />
    </div>
  );
}
