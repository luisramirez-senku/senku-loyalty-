import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Logo from "@/components/app/shared/logo";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="pb-4">
           <div className="flex items-center justify-center gap-4 mb-4">
             <Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Bienvenido a Senku Lealtad</CardTitle>
          <CardDescription className="pt-2">
            La plataforma moderna para crear y gestionar programas de lealtad que tus clientes amarán.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Link href="/login" passHref>
            <Button size="lg" className="w-full">
              Iniciar Sesión
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
           <Link href="/signup" passHref>
            <Button size="lg" className="w-full" variant="outline">
              Registrarse
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
