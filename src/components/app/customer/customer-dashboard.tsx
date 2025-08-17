
'use client';

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import LoyaltyCard from "./loyalty-card";
import VirtualAssistant from "./virtual-assistant";
import { Gift, Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Reward } from "@/components/app/admin/reward-management";
import { Skeleton } from "@/components/ui/skeleton";


export default function CustomerDashboard() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rewards"));
        const rewardsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reward));
        setRewards(rewardsData);
      } catch (error) {
        console.error("Error al obtener las recompensas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <LoyaltyCard />
          <Card>
            <CardHeader>
              <CardTitle>Recompensas Disponibles</CardTitle>
              <CardDescription>
                Usa tus puntos para canjear estas recompensas.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                       <Skeleton className="h-6 w-3/4" />
                       <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                     <CardContent>
                       <Skeleton className="h-5 w-24" />
                    </CardContent>
                    <CardContent>
                       <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                rewards.map((reward) => (
                  <Card key={reward.id} className="flex flex-col">
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                      <div className="shrink-0 p-2 bg-primary/10 rounded-full">
                        <Gift className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>{reward.name}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-lg font-bold text-primary">{reward.cost.toLocaleString()} puntos</p>
                    </CardContent>
                    <CardContent className="mt-auto">
                      <Button className="w-full">Canjear ahora</Button>
                    </CardContent>
                  </Card>
                ))
              )}
               {!loading && rewards.length === 0 && (
                <div className="text-center text-muted-foreground py-16 sm:col-span-2">
                    <p>No hay recompensas disponibles en este momento. Vuelve a consultar pronto.</p>
                </div>
                )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <VirtualAssistant />
        </div>
      </div>
    </div>
  );
}
