
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs, doc, updateDoc, writeBatch } from "firebase/firestore";
import type { Customer } from "@/components/app/admin/customer-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Star, Ticket, ScanLine, User, DollarSign, ArrowRight, Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function CashierView() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
        toast({ variant: "destructive", title: "Búsqueda vacía", description: "Por favor, introduzca un término de búsqueda." });
        return;
    }
    setLoading(true);
    setCustomer(null);
    try {
        const customersRef = collection(db, "customers");
        const q = query(customersRef, where("email", "==", searchQuery.toLowerCase()));
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast({ variant: "destructive", title: "Cliente no encontrado", description: "No se encontró ningún cliente con ese correo electrónico." });
        } else {
            // Asumimos que el correo electrónico es único
            const customerDoc = querySnapshot.docs[0];
            setCustomer({ id: customerDoc.id, ...customerDoc.data() } as Customer);
        }
    } catch (error) {
        console.error("Error buscando cliente:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo realizar la búsqueda." });
    } finally {
        setLoading(false);
    }
  };

  const handleEndSession = () => {
    setCustomer(null);
    setPurchaseAmount("");
    setSearchQuery("");
  };

  const handleAccruePoints = async () => {
    const amount = parseFloat(purchaseAmount);
    if (!customer || isNaN(amount) || amount <= 0) {
        toast({
            variant: "destructive",
            title: "Entrada no válida",
            description: "Por favor, introduzca un monto de compra válido.",
        });
        return;
    }
    setLoading(true);
    try {
        // Simular la lógica de cálculo de puntos (ej: 10 puntos por cada $1)
        const pointsEarned = Math.floor(amount * 10);
        const newTotalPoints = customer.points + pointsEarned;
        
        const customerRef = doc(db, "customers", customer.id);
        await updateDoc(customerRef, {
            points: newTotalPoints
        });
        
        const updatedCustomer = {
            ...customer,
            points: newTotalPoints
        };

        setCustomer(updatedCustomer);

        toast({
            title: "¡Puntos Acreditados!",
            description: `${customer.name} ha ganado ${pointsEarned} puntos. Nuevo total: ${updatedCustomer.points.toLocaleString()}.`,
        });

        setPurchaseAmount("");
    } catch(error) {
         console.error("Error acreditando puntos:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudieron acreditar los puntos." });
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Terminal de Cajero</CardTitle>
          <CardDescription>
            Busque clientes para aplicar recompensas y registrar compras.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!customer ? (
            <>
              <div className="flex gap-2">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="search">Encontrar Cliente (por correo electrónico)</Label>
                  <Input
                    type="email"
                    id="search"
                    placeholder="cliente@ejemplo.com"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    disabled={loading}
                  />
                </div>
                <Button onClick={handleSearch} className="self-end" disabled={loading}>
                  {loading ? <Loader className="h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4" />}
                  Buscar
                </Button>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="lg" disabled={loading}>
                  <ScanLine className="mr-2 h-5 w-5" /> Escanear Tarjeta Digital
                </Button>
              </div>
            </>
          ) : (
            <Card className="bg-secondary/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary" data-ai-hint="person portrait">
                  <AvatarImage src={`https://placehold.co/100x100.png?text=${customer.initials}`} />
                  <AvatarFallback>{customer.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{customer.name}</CardTitle>
                  <CardDescription>{customer.tier}</CardDescription>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary mt-1">
                    <Star className="h-4 w-4 fill-primary" />
                    <span>{customer.points.toLocaleString()} Puntos</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Registrar Compra */}
                <div>
                    <h3 className="font-semibold mb-2">Registrar Compra</h3>
                    <div className="flex items-end gap-2 p-3 rounded-lg border bg-background">
                         <div className="flex-1">
                            <Label htmlFor="purchase-amount">Monto de la Compra</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="purchase-amount" 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={purchaseAmount} 
                                    onChange={(e) => setPurchaseAmount(e.target.value)}
                                    className="pl-8"
                                    disabled={loading}
                                />
                            </div>
                         </div>
                         <Button onClick={handleAccruePoints} disabled={loading}>
                            {loading ? <Loader className="h-4 w-4 animate-spin"/> : <ArrowRight className="mr-2 h-4 w-4"/>} 
                            Acreditar
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Recompensas Disponibles */}
                <div>
                    <h3 className="font-semibold mb-2">Recompensas Disponibles</h3>
                    <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
                        <div className="flex items-center gap-3">
                        <Ticket className="h-5 w-5 text-primary" />
                        <span className="font-medium">Café o Té Gratis (1500 pts)</span>
                        </div>
                        <Button size="sm" disabled={customer.points < 1500}>Aplicar</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
                        <div className="flex items-center gap-3">
                        <Ticket className="h-5 w-5 text-primary" />
                        <span className="font-medium">20% de Descuento (5000 pts)</span>
                        </div>
                        <Button size="sm" disabled={customer.points < 5000}>Aplicar</Button>
                    </div>
                    </div>
                </div>
              </CardContent>
               <CardFooter>
                 <Button variant="outline" className="w-full" onClick={handleEndSession} disabled={loading}>
                    <User className="mr-2 h-4 w-4" /> Finalizar Sesión
                </Button>
               </CardFooter>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
