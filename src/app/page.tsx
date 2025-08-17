
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Logo from "@/components/app/shared/logo";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl text-center shadow-xl">
        <CardHeader className="pb-4">
           <div className="flex items-center justify-center gap-4 mb-4">
             <Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Bienvenido a Senku Lealtad</CardTitle>
          <CardDescription className="pt-2">
            Tu plataforma de lealtad está lista. Inicia sesión para comenzar a administrar tu programa y clientes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
            <Link href="/login" passHref>
                <Button size="lg" className="w-full max-w-xs">
                Iniciar Sesión
                <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </CardContent>
      </Card>
       <div className="mt-4 text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Regístrate
        </Link>
      </div>
    </div>
  );
}
