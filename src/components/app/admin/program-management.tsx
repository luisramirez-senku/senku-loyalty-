
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
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
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type ProgramStatus = "Activo" | "Borrador" | "Archivado";

export type Program = {
    id: string;
    name: string;
    type: "Puntos" | "Sellos" | "Cashback";
    status: ProgramStatus;
    members: number;
    created: string;
};

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
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "programs"));
        const programsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Program));
        setPrograms(programsData);
      } catch (error) {
        console.error("Error al obtener los programas: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los programas desde la base de datos.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleUpdateStatus = async (programId: string, status: ProgramStatus) => {
    try {
      const programRef = doc(db, "programs", programId);
      await updateDoc(programRef, { status });
      setPrograms(programs.map(p => p.id === programId ? { ...p, status } : p));
      toast({
        title: "Programa Actualizado",
        description: `El estado del programa ha sido cambiado a ${status}.`,
      });
    } catch (error) {
      console.error("Error al actualizar el programa: ", error);
       toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo actualizar el estado del programa.",
        });
    }
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
        {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 pt-4 border-t">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                    </CardFooter>
                </Card>
            ))
        ) : (
            programs.map((program) => (
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
                            <DropdownMenuItem asChild>
                                <Link href="/admin/programs/new">Editar</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/programs/${program.id}`}>Ver detalles</Link>
                            </DropdownMenuItem>
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
            ))
        )}
      </div>
      </TooltipProvider>
    </div>
  );
}
