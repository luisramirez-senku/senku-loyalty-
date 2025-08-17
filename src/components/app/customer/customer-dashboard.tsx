
'use client';

import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import LoyaltyCard from "./loyalty-card";
import VirtualAssistant from "./virtual-assistant";
import { Gift, Loader, History } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Reward } from "@/components/app/admin/reward-management";
import type { Customer } from "@/components/app/admin/customer-management";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


interface CustomerDashboardProps {
    customerId: string;
}

const DEMO_TENANT_ID = 'HUI2lwm11IYraNz0LyPv1Q597H73';
const DEMO_CUSTOMER_ID = 'bAsz8Nn9EaN5Sg2v3j0K';

const demoRewards: Reward[] = [
    { id: "reward_1", name: "Café Gratis", description: "Cualquier café de tamaño mediano.", cost: 1500 },
    { id: "reward_2", name: "Pastel del día", description: "Una rebanada de nuestro pastel del día.", cost: 2500 },
    { id: "reward_3", name: "Descuento del 20%", description: "20% de descuento en tu compra total.", cost: 5000 },
    { id: "reward_4", name: "Taza de Marca", description: "Una taza de cerámica con nuestro logo.", cost: 7500 },
];

const demoHistory = [
    {id: "tx_1", date: "2024-05-20", description: "Compra Grande", points: 500},
    {id: "tx_2", date: "2024-05-18", description: "Canje de Café", points: -1500},
];


export default function CustomerDashboard({ customerId }: CustomerDashboardProps) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        if (!customerId) {
            setLoading(false);
            return;
        }
      try {
        // Find which tenant the customer belongs to
        const tenantsCollection = collection(db, 'tenants');
        const tenantsSnapshot = await getDocs(tenantsCollection);
        let foundCustomer: Customer | null = null;
        let foundTenantId: string | null = null;

        for (const tenantDoc of tenantsSnapshot.docs) {
          const customerRef = doc(db, 'tenants', tenantDoc.id, 'customers', customerId);
          const customerSnap = await getDoc(customerRef);
          if (customerSnap.exists()) {
            foundCustomer = {id: customerSnap.id, ...customerSnap.data()} as Customer;
            foundTenantId = tenantDoc.id;
            break;
          }
        }
        
        if (foundCustomer && foundTenantId) {
          setCustomer(foundCustomer);
          setTenantId(foundTenantId);

          // Fetch Rewards for that tenant
          const rewardsCollection = collection(db, "tenants", foundTenantId, "rewards");
          const rewardsSnapshot = await getDocs(rewardsCollection);

          if (rewardsSnapshot.empty && foundTenantId === DEMO_TENANT_ID && customerId === DEMO_CUSTOMER_ID) {
            setRewards(demoRewards);
            setCustomer(c => c ? { ...c, history: demoHistory } : null);
          } else {
            const rewardsData = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reward));
            setRewards(rewardsData);
          }
        } else {
            console.error("Customer not found in any tenant.");
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [customerId]);


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <LoyaltyCard customerId={customerId} />
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
                      <Button className="w-full" disabled={!customer || customer.points < reward.cost}>Canjear ahora</Button>
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
           <Card>
            <CardHeader>
              <CardTitle>Historial de Actividad</CardTitle>
              <CardDescription>
                Aquí puedes ver tus transacciones recientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : customer && customer.history && customer.history.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                      <TableHead className="text-right">Puntos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.history.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.description}</TableCell>
                        <TableCell className="hidden sm:table-cell">{tx.date}</TableCell>
                        <TableCell className="text-right">
                           <Badge variant={tx.points > 0 ? 'default' : 'destructive'}>
                                {tx.points > 0 ? `+${tx.points}` : tx.points}
                            </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground py-16">
                    <History className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold">Sin actividad</h3>
                    <p className="mt-1 text-sm text-gray-500">Aún no tienes transacciones.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <VirtualAssistant customerId={customerId} />
        </div>
      </div>
    </div>
  );
}
