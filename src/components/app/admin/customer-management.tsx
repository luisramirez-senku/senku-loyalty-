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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const customers = [
  {
    name: "Liam Johnson",
    email: "liam@example.com",
    tier: "Oro",
    points: 12500,
    segment: "Alto valor",
    joined: "2023-10-18",
  },
  {
    name: "Olivia Smith",
    email: "olivia@example.com",
    tier: "Plata",
    points: 7200,
    segment: "Comprador frecuente",
    joined: "2023-11-05",
  },
  {
    name: "Noah Williams",
    email: "noah@example.com",
    tier: "Bronce",
    points: 1500,
    segment: "Nuevo miembro",
    joined: "2024-03-15",
  },
  {
    name: "Emma Brown",
    email: "emma@example.com",
    tier: "Oro",
    points: 25000,
    segment: "VIP",
    joined: "2022-05-20",
  },
  {
    name: "Ava Jones",
    email: "ava@example.com",
    tier: "Plata",
    points: 5500,
    segment: "En riesgo",
    joined: "2023-12-01",
  },
];

export default function CustomerManagement() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Agregar Cliente
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>CRM de Clientes</CardTitle>
          <CardDescription>
            Administre a sus clientes y vea el estado de su lealtad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead className="hidden md:table-cell">Segmento</TableHead>
                <TableHead className="hidden md:table-cell">
                  Fecha de ingreso
                </TableHead>
                <TableHead className="text-right">Puntos</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.tier === 'Oro' ? 'default' : customer.tier === 'Plata' ? 'secondary' : 'outline'}>{customer.tier}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.segment}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.joined}
                  </TableCell>
                  <TableCell className="text-right">{customer.points.toLocaleString()}</TableCell>
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
                        <DropdownMenuItem>Ver historial</DropdownMenuItem>
                        <DropdownMenuItem>Eliminar</DropdownMenuItem>
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
