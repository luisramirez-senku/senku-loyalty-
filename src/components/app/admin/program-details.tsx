
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
import { ArrowLeft, CreditCard, DollarSign, Percent, Star, Users, Link as LinkIcon, QrCode } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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


export default function ProgramDetails({ program }: ProgramDetailsProps) {
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
        <Card className="lg:col-span-2">
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
                 <Link href={`/register/${program.id}`} passHref>
                    <Button variant="link" className="p-0 h-auto">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        /register/{program.id}
                    </Button>
                </Link>
            </CardContent>
            <CardFooter>
                 <p className="text-xs text-muted-foreground">
                    Creado el {program.created}
                </p>
            </CardFooter>
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
      </div>
    </div>
  );
}
