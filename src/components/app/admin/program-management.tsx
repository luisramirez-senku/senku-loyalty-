"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, CreditCard, Star, Percent, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const programs = [
  {
    name: "Programa de Puntos Premium",
    type: "Puntos",
    status: "Activo",
    members: 8234,
    created: "2023-01-15",
  },
  {
    name: "Tarjeta de sellos de café",
    type: "Sellos",
    status: "Activo",
    members: 4512,
    created: "2023-06-01",
  },
  {
    name: "Recompensas VIP de Cashback",
    type: "Cashback",
    status: "Activo",
    members: 1024,
    created: "2022-11-20",
  },
  {
    name: "Promociones de verano",
    type: "Puntos",
    status: "Borrador",
    members: 0,
    created: "2024-05-10",
  },
  {
    name: "Estampida de vacaciones",
    type: "Sellos",
    status: "Archivado",
    members: 7890,
    created: "2022-12-01",
  },
];

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case "Puntos":
            return <Star className="h-4 w-4" />;
        case "Sellos":
            return <CreditCard className="h-4 w-4" />;
        case "Cashback":
            return <Percent className="h-4 w-4" />;
        default:
            return null;
    }
}

export default function ProgramManagement() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Programas</h2>
            <p className="text-muted-foreground">
                Cree y gestione sus programas de lealtad.
            </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Programa
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{program.name}</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menú de palanca</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Archivar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>
                <div className="flex items-center gap-2 text-sm">
                    <TypeIcon type={program.type} />
                    <span>{program.type}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
               <Badge variant={program.status === 'Activo' ? 'default' : program.status === 'Borrador' ? 'outline' : 'secondary'}>{program.status}</Badge>
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{program.members.toLocaleString()} miembros</span>
               </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
                Creado el {program.created}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
