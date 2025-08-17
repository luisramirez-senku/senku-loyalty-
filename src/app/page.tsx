import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, UserCircle, Gem } from "lucide-react";
import Logo from "@/components/app/shared/logo";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex items-center gap-4 mb-8">
        <Logo className="h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">Senku Lealtad</h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Seleccionar un rol de usuario
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Link href="/customer" passHref>
            <Button size="lg" className="w-full justify-start">
              <UserCircle className="mr-4" />
              Cliente
            </Button>
          </Link>
          <Link href="/cashier" passHref>
            <Button size="lg" className="w-full justify-start">
              <User className="mr-4" />
              Cajero
            </Button>
          </Link>
          <Link href="/admin" passHref>
            <Button size="lg" className="w-full justify-start">
              <Shield className="mr-4" />
              Administrador
            </Button>
          </Link>
           <Link href="/super-admin" passHref>
            <Button size="lg" className="w-full justify-start" variant="outline">
              <Gem className="mr-4" />
              Super Admin
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
