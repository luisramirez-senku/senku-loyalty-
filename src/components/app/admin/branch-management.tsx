
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, MapPin, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AddEditBranchDialog } from "./add-edit-branch-dialog";
// import { DeleteRewardDialog } from "./delete-reward-dialog"; // This will need a generic delete dialog
import { useAuth } from "@/hooks/use-auth";


export type Branch = {
    id: string;
    name: string;
    address: string;
    location: {
        lat: number;
        lng: number;
    };
};

export default function BranchManagement() {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddEditOpen, setAddEditOpen] = useState(false);
//   const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const branchesCollection = collection(db, "tenants", user.uid, "branches");
        const querySnapshot = await getDocs(branchesCollection);
        const branchesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Branch));
        setBranches(branchesData);
      } catch (error) {
        console.error("Error al obtener las sucursales:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las sucursales.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [user]);

  const handleAdd = () => {
    setSelectedBranch(null);
    setAddEditOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setAddEditOpen(true);
  };

//   const handleDelete = (branch: Branch) => {
//     setSelectedBranch(branch);
//     setDeleteOpen(true);
//   };

  const onSave = async (branchData: Omit<Branch, 'id'> & { id?: string }) => {
    if (!user) return;
    try {
      const branchesCollection = collection(db, "tenants", user.uid, "branches");
      if (branchData.id) { // Editing
        const branchRef = doc(branchesCollection, branchData.id);
        const { id, ...dataToUpdate } = branchData;
        await updateDoc(branchRef, dataToUpdate);
        setBranches(branches.map(b => b.id === branchData.id ? { ...b, ...dataToUpdate, id: b.id } : b));
        toast({ title: "Sucursal Actualizada", description: "Los datos de la sucursal han sido guardados." });
      } else { // Adding
        const docRef = await addDoc(branchesCollection, branchData);
        setBranches([...branches, { ...branchData, id: docRef.id }]);
        toast({ title: "Sucursal Agregada", description: "La nueva sucursal ha sido creada." });
      }
      setAddEditOpen(false);
    } catch (error) {
      console.error("Error guardando la sucursal:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la sucursal." });
    }
  };

//   const onDelete = async (branchId: string) => {
//     if (!user) return;
//     try {
//       const branchRef = doc(db, "tenants", user.uid, "branches", branchId);
//       await deleteDoc(branchRef);
//       setBranches(branches.filter(b => b.id !== branchId));
//       setDeleteOpen(false);
//       toast({ title: "Sucursal Eliminada", description: "La sucursal ha sido eliminada." });
//     } catch (error)
//     {
//         console.error("Error eliminando la sucursal:", error);
//         toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar la sucursal." });
//     }
//   }


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sucursales</h2>
            <p className="text-muted-foreground">
              Gestione las ubicaciones de su negocio para el marketing geolocalizado.
            </p>
          </div>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Sucursal
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full mt-1" />
                        </CardHeader>
                        <CardFooter>
                            <Skeleton className="h-9 w-full" />
                        </CardFooter>
                    </Card>
                ))
            ) : branches.length > 0 ? (
                branches.map((branch) => (
                    <Card key={branch.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary"/>
                                {branch.name}
                            </CardTitle>
                            <CardDescription>{branch.address}</CardDescription>
                        </CardHeader>
                        <CardFooter className="border-t pt-4 flex gap-2 mt-auto">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(branch)}>
                                <Edit className="h-4 w-4 mr-2" /> Editar
                            </Button>
                            <Button variant="secondary" size="sm" asChild className="flex-1">
                                <a href={`https://www.google.com/maps/search/?api=1&query=${branch.location.lat},${branch.location.lng}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" /> Ver en Mapa
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <div className="text-center text-muted-foreground py-16 md:col-span-2 lg:col-span-3 xl:col-span-4">
                    <p>No se han creado sucursales todavía. Haga clic en "Crear Sucursal" para empezar.</p>
                </div>
            )}
        </div>
      </div>

      <AddEditBranchDialog
        isOpen={isAddEditOpen}
        setIsOpen={setAddEditOpen}
        branch={selectedBranch}
        onSave={onSave}
      />
      {/* {selectedBranch && (
        <DeleteRewardDialog
            isOpen={isDeleteOpen}
            setIsOpen={setDeleteOpen}
            reward={selectedBranch}
            onDelete={onDelete}
        />
      )} */}
    </>
  );
}
