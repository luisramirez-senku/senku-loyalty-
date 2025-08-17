
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Logo from "@/components/app/shared/logo";
import { ArrowRight, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeBlock } from "@/components/app/shared/code-block";

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
            Tu plataforma de lealtad está lista. Inicia sesión para administrarla o sigue los siguientes pasos para expandir la funcionalidad con un backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
            <Link href="/login" passHref>
                <Button size="lg" className="w-full max-w-xs">
                Iniciar Sesión
                <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>

            <Alert className="text-left">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Próximos Pasos: Configurar el Backend</AlertTitle>
                <AlertDescription>
                    Para funcionalidades avanzadas como la integración con Google Wallet o la ejecución de tareas programadas, necesitas un backend. Usa Cloud Functions for Firebase.
                    <div className="space-y-4 mt-4">
                        <div>
                            <p className="font-semibold">1. Instala la CLI de Firebase:</p>
                            <CodeBlock code="npm install -g firebase-tools" />
                        </div>
                        <div>
                            <p className="font-semibold">2. Inicia sesión en Firebase:</p>
                             <CodeBlock code="firebase login" />
                        </div>
                         <div>
                            <p className="font-semibold">3. Inicializa Cloud Functions en tu proyecto:</p>
                             <CodeBlock code="firebase init functions" />
                             <p className="text-xs text-muted-foreground mt-1">Selecciona TypeScript cuando se te pregunte.</p>
                        </div>
                    </div>
                </AlertDescription>
            </Alert>
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

