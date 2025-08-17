
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";

type TenantPlan = "Gratis" | "Pro" | "Empresarial";
type TenantStatus = "Activo" | "Prueba" | "Cancelado";

type Tenant = {
    id: string;
    name: string;
    plan: TenantPlan;
    status: TenantStatus;
    members: number;
    createdAt: string;
};

const tenants: Tenant[] = [
    { id: '1', name: 'Café Central', plan: 'Pro', status: 'Activo', members: 1250, createdAt: '2023-01-15' },
    { id: '2', name: 'Librería El Saber', plan: 'Pro', status: 'Activo', members: 340, createdAt: '2023-02-20' },
    { id: '3', name: 'Gimnasio Fuerte', plan: 'Gratis', status: 'Prueba', members: 50, createdAt: '2023-06-01' },
    { id: '4', name: 'Spa Relajación Total', plan: 'Empresarial', status: 'Activo', members: 850, createdAt: '2022-11-10' },
    { id: '5', name: 'Tienda de Mascotas', plan: 'Pro', status: 'Cancelado', members: 210, createdAt: '2023-03-05' },
];


export default function TenantManagement() {
  const router = useRouter();

  const handleImpersonate = () => {
    router.push('/admin');
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Clientes (Inquilinos)</CardTitle>
            <CardDescription>
                Una lista de todos los negocios que usan su plataforma.
            </CardDescription>
        </div>
        <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Añadir Cliente
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Plan</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Miembros</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                    <TableCell>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-xs text-muted-foreground hidden md:block">Inscrito: {tenant.createdAt}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{tenant.plan}</TableCell>
                    <TableCell>
                        <Badge variant={tenant.status === 'Activo' ? 'default' : tenant.status === 'Prueba' ? 'secondary' : 'destructive'}>
                            {tenant.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">{tenant.members.toLocaleString()}</TableCell>
                     <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menú</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={handleImpersonate}>Ver Panel</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Suspender</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
