"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
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
import { MoreHorizontal, PlusCircle, Star, CalendarDays, Users, Calendar as CalendarIcon, FilterX, Info, Edit, History, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const customers = [
  {
    name: "Liam Johnson",
    email: "liam@example.com",
    tier: "Oro",
    points: 12500,
    segment: "Alto valor",
    joined: "2023-10-18",
    initials: "LJ"
  },
  {
    name: "Olivia Smith",
    email: "olivia@example.com",
    tier: "Plata",
    points: 7200,
    segment: "Comprador frecuente",
    joined: "2023-11-05",
    initials: "OS"
  },
  {
    name: "Noah Williams",
    email: "noah@example.com",
    tier: "Bronce",
    points: 1500,
    segment: "Nuevo miembro",
    joined: "2024-03-15",
    initials: "NW"
  },
  {
    name: "Emma Brown",
    email: "emma@example.com",
    tier: "Oro",
    points: 25000,
    segment: "VIP",
    joined: "2022-05-20",
    initials: "EB"
  },
  {
    name: "Ava Jones",
    email: "ava@example.com",
    tier: "Plata",
    points: 5500,
    segment: "En riesgo",
    joined: "2023-12-01",
    initials: "AJ"
  },
];

const customerSegments = ["Alto valor", "Comprador frecuente", "Nuevo miembro", "VIP", "En riesgo"];

const segmentDescriptions: Record<string, string> = {
    "Alto valor": "Clientes que gastan significativamente más que el promedio.",
    "Comprador frecuente": "Clientes que realizan compras de forma regular.",
    "Nuevo miembro": "Clientes que se han unido recientemente al programa de lealtad.",
    "VIP": "Los clientes más valiosos que reciben beneficios exclusivos.",
    "En riesgo": "Clientes que no han realizado una compra en un tiempo y podrían abandonar el programa.",
};


export default function CustomerManagement() {
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const [segmentFilter, setSegmentFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined);

    const applyFilters = (segment: string, dateRange?: DateRange) => {
        let updatedCustomers = customers;
        if (segment) {
            updatedCustomers = updatedCustomers.filter(c => c.segment === segment);
        }
        if (dateRange?.from) {
            updatedCustomers = updatedCustomers.filter(c => {
                const joinedDate = new Date(c.joined);
                const fromDate = new Date(dateRange.from!);
                fromDate.setHours(0,0,0,0);
                if (dateRange.to) {
                    const toDate = new Date(dateRange.to);
                    toDate.setHours(23,59,59,999);
                    return joinedDate >= fromDate && joinedDate <= toDate;
                }
                return joinedDate >= fromDate;
            });
        }
        setFilteredCustomers(updatedCustomers);
    }

    const handleSegmentChange = (segment: string) => {
        setSegmentFilter(segment);
        applyFilters(segment, dateFilter);
    }

    const handleDateChange = (dateRange?: DateRange) => {
        setDateFilter(dateRange);
        applyFilters(segmentFilter, dateRange);
    }
    
    const clearFilters = () => {
        setSegmentFilter("");
        setDateFilter(undefined);
        setFilteredCustomers(customers);
    }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
            <p className="text-muted-foreground">
                Administre a sus clientes y vea el estado de su lealtad.
            </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Agregar Cliente
        </Button>
      </div>

    <Card>
        <CardHeader>
            <CardTitle>Filtrar Clientes</CardTitle>
            <CardDescription>Refine la lista de clientes por segmento o fecha de registro.</CardDescription>
            <div className="flex flex-wrap items-center gap-4 pt-4">
                <Select value={segmentFilter} onValueChange={handleSegmentChange}>
                    <SelectTrigger className="w-full md:w-[240px]">
                        <SelectValue placeholder="Filtrar por segmento" />
                    </SelectTrigger>
                    <SelectContent>
                        {customerSegments.map(segment => (
                            <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full md:w-[300px] justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter?.from ? (
                            dateFilter.to ? (
                                <>
                                {format(dateFilter.from, "LLL dd, y")} -{" "}
                                {format(dateFilter.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateFilter.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Filtrar por fecha</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="range"
                        selected={dateFilter}
                        onSelect={handleDateChange}
                        initialFocus
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                {(segmentFilter || dateFilter) && (
                    <Button variant="ghost" onClick={clearFilters}>
                        <FilterX className="mr-2 h-4 w-4" />
                        Limpiar filtros
                    </Button>
                )}
            </div>
        </CardHeader>
    </Card>

    <TooltipProvider>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCustomers.map((customer, index) => (
            <Card key={index} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12" data-ai-hint="person portrait">
                            <AvatarImage src={`https://placehold.co/100x100.png?text=${customer.initials}`} alt={customer.name} />
                            <AvatarFallback>{customer.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{customer.name}</CardTitle>
                            <CardDescription>{customer.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <div className="flex justify-between items-center">
                        <Badge variant={customer.tier === 'Oro' ? 'default' : customer.tier === 'Plata' ? 'secondary' : 'outline'}>{customer.tier}</Badge>
                        <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                            <Star className="h-4 w-4 fill-current" />
                            <span>{customer.points.toLocaleString()} Puntos</span>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Segmento: {customer.segment}</span>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{segmentDescriptions[customer.segment]}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="flex items-center gap-2">
                           <CalendarDays className="h-4 w-4" />
                            <span>Miembro desde: {customer.joined}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4 mt-auto">
                    <div className="flex w-full justify-end gap-2">
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                        <Button variant="outline" size="sm">
                           <History className="h-4 w-4 mr-2" />
                           Ver historial
                        </Button>
                         <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        ))}
      </div>
      </TooltipProvider>
      {filteredCustomers.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
              <p>No se encontraron clientes que coincidan con los filtros seleccionados.</p>
          </div>
      )}
    </div>
  );
}
