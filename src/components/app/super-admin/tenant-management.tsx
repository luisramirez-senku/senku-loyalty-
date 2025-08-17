
"use client";

import { useState, useEffect } from "react";
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

type TenantPlan = "Gratis" | "Pro" | "Empresarial";
type TenantStatus = "Activo" | "Prueba" | "Cancelado" | "Suspendido";

type Tenant = {
    id: string;
    name: string;
    plan: TenantPlan;
    status: TenantStatus;
    members: number; // This would need to be calculated in a real app
    createdAt: string;
};

export default function TenantManagement() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
        try {
            const tenantsSnapshot = await getDocs(collection(db, "tenants"));
            const tenantsData: Tenant[] = [];
            for (const doc of tenantsSnapshot.docs) {
                const data = doc.data();
                // In a real app, you'd aggregate the number of customers
                const members = 0; 
                tenantsData.push({
                    id: doc.id,
                    name: data.name,
                    plan: data.plan,
                    status: data.status,
                    createdAt: new Date(data.createdAt).toLocaleDateString(),
                    members
                });
            }
            setTenants(tenantsData);
        } catch (error) {
            console.error("Error fetching tenants: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar los clientes.",
            });
        } finally {
            setLoading(false);
        }
    };
    fetchTenants();
  }, []);

  const handleImpersonate = () => {
    router.push('/admin');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes (Inquilinos)</CardTitle>
        <CardDescription>
            Una lista de todos los negocios que usan su plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Plan</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha de registro</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))
            ) : (
                tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                        <TableCell>
                            <div className="font-medium">{tenant.name}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{tenant.plan}</TableCell>
                        <TableCell>
                            <Badge variant={tenant.status === 'Activo' ? 'default' : tenant.status === 'Prueba' ? 'secondary' : 'destructive'}>
                                {tenant.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{tenant.createdAt}</TableCell>
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
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
