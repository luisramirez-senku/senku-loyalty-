import CustomerRegistrationForm from "@/components/app/customer/registration-form";
import Logo from "@/components/app/shared/logo";

export default function RegistrationPage({ params }: { params: { programId: string } }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="flex items-center gap-4 mb-8">
        <Logo className="h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">Senku Lealtad</h1>
      </div>
      <CustomerRegistrationForm programId={params.programId} />
    </div>
  );
}
