
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
import { PlusCircle, Edit, Trash2, Gift } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AddEditRewardDialog } from "./add-edit-reward-dialog";
import { DeleteRewardDialog } from "./delete-reward-dialog";


export type Reward = {
    id: string;
    name: string;
    description: string;
    cost: number;
};

export default function RewardManagement() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddEditOpen, setAddEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rewards"));
        const rewardsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reward));
        setRewards(rewardsData);
      } catch (error) {
        console.error("Error al obtener las recompensas:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las recompensas.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const handleAdd = () => {
    setSelectedReward(null);
    setAddEditOpen(true);
  };

  const handleEdit = (reward: Reward) => {
    setSelectedReward(reward);
    setAddEditOpen(true);
  };

  const handleDelete = (reward: Reward) => {
    setSelectedReward(reward);
    setDeleteOpen(true);
  };

  const onSave = async (rewardData: Omit<Reward, 'id'> & { id?: string }) => {
    try {
      if (rewardData.id) { // Editing
        const rewardRef = doc(db, "rewards", rewardData.id);
        const { id, ...dataToUpdate } = rewardData;
        await updateDoc(rewardRef, dataToUpdate);
        setRewards(rewards.map(r => r.id === rewardData.id ? { ...r, ...dataToUpdate, id: r.id } : r));
        toast({ title: "Recompensa Actualizada", description: "Los datos de la recompensa han sido guardados." });
      } else { // Adding
        const docRef = await addDoc(collection(db, "rewards"), rewardData);
        setRewards([...rewards, { ...rewardData, id: docRef.id }]);
        toast({ title: "Recompensa Agregada", description: "La nueva recompensa ha sido creada." });
      }
      setAddEditOpen(false);
    } catch (error) {
      console.error("Error guardando la recompensa:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo guardar la recompensa." });
    }
  };

  const onDelete = async (rewardId: string) => {
    try {
      await deleteDoc(doc(db, "rewards", rewardId));
      setRewards(rewards.filter(r => r.id !== rewardId));
      setDeleteOpen(false);
      toast({ title: "Recompensa Eliminada", description: "La recompensa ha sido eliminada." });
    } catch (error)
    {
        console.error("Error eliminando la recompensa:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar la recompensa." });
    }
  }


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Recompensas</h2>
            <p className="text-muted-foreground">
              Cree y gestione las recompensas que los clientes pueden canjear con sus puntos.
            </p>
          </div>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Recompensa
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-1" />
                        </CardHeader>
                        <CardContent>
                             <Skeleton className="h-5 w-24" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-9 w-1/2" />
                        </CardFooter>
                    </Card>
                ))
            ) : (
                rewards.map((reward) => (
                    <Card key={reward.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gift className="h-5 w-5 text-primary"/>
                                {reward.name}
                            </CardTitle>
                            <CardDescription>{reward.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="font-bold text-lg text-primary">{reward.cost.toLocaleString()} puntos</p>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(reward)}>
                                <Edit className="h-4 w-4 mr-2" /> Editar
                            </Button>
                            <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(reward)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            )}
        </div>
         {!loading && rewards.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
              <p>No se han creado recompensas todavía. Haga clic en "Crear Recompensa" para empezar.</p>
          </div>
      )}
      </div>

      <AddEditRewardDialog
        isOpen={isAddEditOpen}
        setIsOpen={setAddEditOpen}
        reward={selectedReward}
        onSave={onSave}
      />
      {selectedReward && (
        <DeleteRewardDialog
            isOpen={isDeleteOpen}
            setIsOpen={setDeleteOpen}
            reward={selectedReward}
            onDelete={onDelete}
        />
      )}
    </>
  );
}
