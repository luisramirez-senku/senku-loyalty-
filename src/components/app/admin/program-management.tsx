
"use client";

import { useState } from "react";
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
import { MoreHorizontal, PlusCircle, CreditCard, Star, Percent, Users, Link as LinkIcon, Archive, ArchiveRestore } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ProgramStatus = "Activo" | "Borrador" | "Archivado";

type Program = {
    id: string;
    name: string;
    type: "Puntos" | "Sellos" | "Cashback";
    status: ProgramStatus;
    members: number;
    created: string;
};

const initialPrograms: Program[] = [
  {
    id: "prog_1",
    name: "Programa de Puntos Premium",
    type: "Puntos",
    status: "Activo",
    members: 8234,
    created: "2023-01-15",
  },
  {
    id: "prog_2",
    name: "Tarjeta de sellos de café",
    type: "Sellos",
    status: "Activo",
    members: 4512,
    created: "2023-06-01",
  },
  {
    id: "prog_3",
    name: "Recompensas VIP de Cashback",
    type: "Cashback",
    status: "Activo",
    members: 1024,
    created: "2022-11-20",
  },
  {
    id: "prog_4",
    name: "Promociones de verano",
    type: "Puntos",
    status: "Borrador",
    members: 0,
    created: "2024-05-10",
  },
  {
    id: "prog_5",
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
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);

  const handleUpdateStatus = (programId: string, status: ProgramStatus) => {
    setPrograms(programs.map(p => p.id === programId ? { ...p, status } : p));
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Programas</h2>
            <p className="text-muted-foreground">
                Cree y gestione sus programas de lealtad.
            </p>
        </div>
        <Link href="/admin/programs/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Programa
          </Button>
        </Link>
      </div>
      <TooltipProvider>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <Card key={program.id} className="flex flex-col">
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
                        <DropdownMenuSeparator />
                        {program.status !== 'Archivado' ? (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(program.id, 'Archivado')}>
                                <Archive className="mr-2 h-4 w-4" />
                                Archivar
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(program.id, 'Activo')}>
                                <ArchiveRestore className="mr-2 h-4 w-4" />
                                Restaurar
                            </DropdownMenuItem>
                        )}
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
            <CardFooter className="flex-col items-start gap-2 pt-4 border-t">
                <Link href={`/register/${program.id}`} passHref>
                    <Button variant="link" className="p-0 h-auto">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Enlace de registro
                    </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                    Creado el {program.created}
                </p>
            </CardFooter>
          </Card>
        ))}
      </div>
      </TooltipProvider>
    </div>
  );
}
