"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, CreditCard, Star, Percent } from "lucide-react";
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
            return <Star className="h-4 w-4 text-muted-foreground" />;
        case "Sellos":
            return <CreditCard className="h-4 w-4 text-muted-foreground" />;
        case "Cashback":
            return <Percent className="h-4 w-4 text-muted-foreground" />;
        default:
            return null;
    }
}

export default function ProgramManagement() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Programas</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Programa
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Programas de lealtad</CardTitle>
          <CardDescription>
            Cree y gestione sus programas de lealtad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del programa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Creado</TableHead>
                <TableHead className="text-right">Miembros</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <TypeIcon type={program.type} />
                        {program.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={program.status === 'Activo' ? 'default' : program.status === 'Borrador' ? 'outline' : 'secondary'}>{program.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {program.created}
                  </TableCell>
                  <TableCell className="text-right">{program.members.toLocaleString()}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
