
"use client";

import type { Program } from "./program-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, DollarSign, Gift, Link as LinkIcon, Percent, QrCode, ShoppingBag, Star, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

// Extiende el tipo Program para incluir los detalles que podríamos tener.
interface ProgramDetailsProps {
  program: Program & {
    description?: string;
    rules?: {
      pointsPerAmount?: number;
      amountForPoints?: number;
      stampsCount?: number;
      cashbackPercentage?: number;
    };
    design?: {
      logoText?: string;
      backgroundColor?: string;
      foregroundColor?: string;
      labelColor?: string;
    };
  };
}

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case "Puntos":
            return <Star className="h-5 w-5 text-primary" />;
        case "Sellos":
            return <CreditCard className="h-5 w-5 text-primary" />;
        case "Cashback":
            return <Percent className="h-5 w-5 text-primary" />;
        default:
            return null;
    }
}

const recentMembers = [
    { name: "Liam Johnson", initials: "LJ" },
    { name: "Olivia Smith", initials: "OS" },
    { name: "Noah Williams", initials: "NW" },
    { name: "Emma Brown", initials: "EB" },
    { name: "Ava Jones", initials: "AJ" },
];

const recentTransactions = [
    { name: "Liam Johnson", description: "Compra de $15", points: 150, icon: <ShoppingBag className="h-5 w-5 text-muted-foreground" /> },
    { name: "Emma Brown", description: "Canje de recompensa", points: -2500, icon: <Gift className="h-5 w-5 text-muted-foreground" /> },
    { name: "Olivia Smith", description: "Compra de $8", points: 80, icon: <ShoppingBag className="h-5 w-5 text-muted-foreground" /> },
    { name: "Noah Williams", description: "Bono de registro", points: 100, icon: <Star className="h-5 w-5 text-muted-foreground" /> },
];


export default function ProgramDetails({ program }: ProgramDetailsProps) {
  const { user } = useAuth();
  const [fullRegistrationUrl, setFullRegistrationUrl] = useState("");

  // We need to build the URL on the client side to access window.location.origin
  React.useEffect(() => {
    if (user) {
        const registrationUrl = `/register/${program.id}?tenant=${user.uid}`;
        setFullRegistrationUrl(`${window.location.origin}${registrationUrl}`);
    }
  }, [user, program.id]);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullRegistrationUrl)}`;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/programs" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{program.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
             <TypeIcon type={program.type} />
             <span>Programa de {program.type}</span>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>{program.description || 'No hay descripción disponible.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Estado:</span>
                    <Badge variant={program.status === 'Activo' ? 'default' : program.status === 'Borrador' ? 'outline' : 'secondary'}>
                        {program.status}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{program.members.toLocaleString()} miembros</span>
                </div>
                 <Link href={fullRegistrationUrl} passHref>
                    <Button variant="link" className="p-0 h-auto">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        {fullRegistrationUrl}
                    </Button>
                </Link>
            </CardContent>
            <CardFooter>
                 <p className="text-xs text-muted-foreground">
                    Creado el {program.created}
                </p>
            </CardFooter>
        </Card>

        <Card className="row-span-2">
            <CardHeader>
                <CardTitle>Enlace de registro con QR</CardTitle>
                <CardDescription>Use este QR para que los clientes se registren fácilmente.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
                {fullRegistrationUrl && <Image src={qrCodeUrl} alt="Código QR de registro" width={200} height={200} className="rounded-lg border p-1" />}
                 <Button asChild disabled={!fullRegistrationUrl}>
                    <a href={fullRegistrationUrl ? qrCodeUrl : '#'} download={`qr-registro-${program.id}.png`}>
                        Descargar QR
                    </a>
                </Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Reglas del Programa</CardTitle>
                <CardDescription>Cómo ganan valor los clientes.</CardDescription>
            </CardHeader>
            <CardContent>
                {program.type === 'Puntos' && program.rules?.pointsPerAmount && (
                    <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span>Gana <strong>{program.rules.pointsPerAmount} puntos</strong> por cada <strong>${program.rules.amountForPoints}</strong> de compra.</span>
                    </div>
                )}
                 {program.type === 'Sellos' && program.rules?.stampsCount && (
                    <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>Completa una tarjeta de <strong>{program.rules.stampsCount} sellos</strong> para obtener una recompensa.</span>
                    </div>
                )}
                 {program.type === 'Cashback' && program.rules?.cashbackPercentage && (
                    <div className="flex items-center gap-2 text-sm">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span>Recibe un <strong>{program.rules.cashbackPercentage}% de cashback</strong> en todas las compras.</span>
                    </div>
                )}
            </CardContent>
        </Card>

         <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Diseño del Pase de Wallet</CardTitle>
                <CardDescription>Vista previa de la tarjeta de lealtad digital.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <div 
                    className="w-full max-w-sm rounded-xl p-4 flex flex-col gap-4 text-white shadow-lg"
                    style={{ 
                        backgroundColor: program.design?.backgroundColor || '#000000',
                        color: program.design?.foregroundColor || '#FFFFFF'
                     }}
                >
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{program.design?.logoText || 'Logo Text'}</h3>
                        <QrCode className="h-8 w-8"/>
                    </div>
                    <div>
                        <p className="text-xs" style={{ color: program.design?.labelColor || '#B0B7C1' }}>PUNTOS</p>
                        <p className="text-2xl font-bold">1,234</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Últimas Transacciones</CardTitle>
                <CardDescription>Actividad reciente en este programa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentTransactions.map((tx, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border">
                            <AvatarFallback>{tx.icon}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{tx.name}</p>
                            <p className="text-sm text-muted-foreground">{tx.description}</p>
                        </div>
                        <Badge variant={tx.points > 0 ? 'default' : 'destructive'}>
                            {tx.points > 0 ? `+${tx.points}` : tx.points}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Miembros Recientes</CardTitle>
                 <CardDescription>Nuevos clientes en este programa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentMembers.map((member, index) => (
                     <div key={index} className="flex items-center gap-4">
                        <Avatar className="h-10 w-10" data-ai-hint="person portrait">
                            <AvatarImage src={`https://placehold.co/40x40.png?text=${member.initials}`} alt={member.name} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">Se unió hoy</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
