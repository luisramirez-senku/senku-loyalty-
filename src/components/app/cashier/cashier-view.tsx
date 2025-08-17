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
import { Search, Star, Ticket, ScanLine, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CashierView() {
  const [customerFound, setCustomerFound] = useState(false);

  const handleSearch = () => {
    // In a real app, this would perform a search.
    // For this demo, we'll just toggle the state.
    setCustomerFound(!customerFound);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Terminal de Cajero</CardTitle>
          <CardDescription>
            Busque clientes para aplicar recompensas de lealtad.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {customerFound && (
            <Card className="bg-secondary/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary" data-ai-hint="person portrait">
                  <AvatarImage src="https://placehold.co/100x100.png" />
                  <AvatarFallback>CW</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Charles Webb</CardTitle>
                  <CardDescription>Miembro de Nivel Oro</CardDescription>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary mt-1">
                    <Star className="h-4 w-4 fill-primary" />
                    <span>25,000 Puntos</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
              </CardContent>
               <CardFooter>
                 <Button variant="outline" className="w-full" onClick={() => setCustomerFound(false)}>
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
