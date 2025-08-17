
"use client";

import { useState } from "react";
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
import { Search, Star, Ticket, ScanLine, User, DollarSign, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const mockCustomer = {
    id: 'cust_123',
    name: 'Charles Webb',
    tier: 'Miembro de Nivel Oro',
    points: 25000,
    programType: 'Puntos', // 'Puntos' o 'Cashback'
    avatarUrl: 'https://placehold.co/100x100.png',
    initials: 'CW'
};

export default function CashierView() {
  const [customer, setCustomer] = useState<typeof mockCustomer | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const { toast } = useToast();

  const handleSearch = () => {
    // En una aplicación real, esto realizaría una búsqueda en la API.
    // Para esta demostración, simplemente establecemos el cliente simulado.
    setCustomer(mockCustomer);
  };

  const handleEndSession = () => {
    setCustomer(null);
    setPurchaseAmount("");
  };

  const handleAccruePoints = () => {
    const amount = parseFloat(purchaseAmount);
    if (!customer || isNaN(amount) || amount <= 0) {
        toast({
            variant: "destructive",
            title: "Entrada no válida",
            description: "Por favor, introduzca un monto de compra válido.",
        });
        return;
    }

    // Simular la lógica de cálculo de puntos (ej: 10 puntos por cada $1)
    const pointsEarned = Math.floor(amount * 10);
    
    const updatedCustomer = {
        ...customer,
        points: customer.points + pointsEarned
    };

    setCustomer(updatedCustomer);

    toast({
        title: "¡Puntos Acreditados!",
        description: `${customer.name} ha ganado ${pointsEarned} puntos. Nuevo total: ${updatedCustomer.points.toLocaleString()}.`,
    });

    setPurchaseAmount("");
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
                  <Label htmlFor="search">Encontrar Cliente</Label>
                  <Input
                    type="text"
                    id="search"
                    placeholder="Nombre, correo electrónico o número de teléfono"
                  />
                </div>
                <Button onClick={handleSearch} className="self-end">
                  <Search className="mr-2 h-4 w-4" /> Buscar
                </Button>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="lg">
                  <ScanLine className="mr-2 h-5 w-5" /> Escanear Tarjeta Digital
                </Button>
              </div>
            </>
          ) : (
            <Card className="bg-secondary/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary" data-ai-hint="person portrait">
                  <AvatarImage src={customer.avatarUrl} />
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
                                />
                            </div>
                         </div>
                         <Button onClick={handleAccruePoints}>
                            <ArrowRight className="mr-2 h-4 w-4"/> Acreditar
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
                        <span className="font-medium">Café o Té Gratis</span>
                        </div>
                        <Button size="sm">Aplicar</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
                        <div className="flex items-center gap-3">
                        <Ticket className="h-5 w-5 text-primary" />
                        <span className="font-medium">20% de Descuento en Mercancía</span>
                        </div>
                        <Button size="sm">Aplicar</Button>
                    </div>
                    </div>
                </div>
              </CardContent>
               <CardFooter>
                 <Button variant="outline" className="w-full" onClick={handleEndSession}>
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
