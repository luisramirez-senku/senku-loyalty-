
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
import { PlusCircle, Star, CalendarDays, Users, Calendar as CalendarIcon, FilterX, Info, Edit, History, Trash2 } from "lucide-react";
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
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import { EditCustomerDialog } from "./edit-customer-dialog";
import { ViewHistoryDialog } from "./view-history-dialog";

// Tipos de datos
export type Customer = {
    id: string;
    name: string;
    email: string;
    tier: "Oro" | "Plata" | "Bronce";
    points: number;
    segment: "Alto valor" | "Comprador frecuente" | "Nuevo miembro" | "VIP" | "En riesgo";
    joined: string;
    initials: string;
    history?: Transaction[];
};

export type Transaction = {
    id: string;
    date: string;
    description: string;
    points: number;
};

const customersData: Customer[] = [
  {
    id: "cust_1",
    name: "Liam Johnson",
    email: "liam@example.com",
    tier: "Oro",
    points: 12500,
    segment: "Alto valor",
    joined: "2023-10-18",
    initials: "LJ",
    history: [
        { id: "t1", date: "2024-05-20", description: "Compra en tienda", points: 150 },
        { id: "t2", date: "2024-05-15", description: "Canje de recompensa: Café gratis", points: -500 },
        { id: "t3", date: "2024-05-01", description: "Bono de cumpleaños", points: 1000 },
    ]
  },
  {
    id: "cust_2",
    name: "Olivia Smith",
    email: "olivia@example.com",
    tier: "Plata",
    points: 7200,
    segment: "Comprador frecuente",
    joined: "2023-11-05",
    initials: "OS",
    history: [
        { id: "t4", date: "2024-05-18", description: "Compra en tienda", points: 80 },
        { id: "t5", date: "2024-05-11", description: "Compra online", points: 120 },
    ]
  },
  {
    id: "cust_3",
    name: "Noah Williams",
    email: "noah@example.com",
    tier: "Bronce",
    points: 1500,
    segment: "Nuevo miembro",
    joined: "2024-03-15",
    initials: "NW",
    history: [
        { id: "t6", date: "2024-03-15", description: "Registro en programa", points: 100 },
    ]
  },
  {
    id: "cust_4",
    name: "Emma Brown",
    email: "emma@example.com",
    tier: "Oro",
    points: 25000,
    segment: "VIP",
    joined: "2022-05-20",
    initials: "EB"
  },
  {
    id: "cust_5",
    name: "Ava Jones",
    email: "ava@example.com",
    tier: "Plata",
    points: 5500,
    segment: "En riesgo",
    joined: "2023-12-01",
    initials: "AJ"
  },
];

export const customerSegments = ["Alto valor", "Comprador frecuente", "Nuevo miembro", "VIP", "En riesgo"];

export const segmentDescriptions: Record<string, string> = {
    "Alto valor": "Clientes que gastan significativamente más que el promedio.",
    "Comprador frecuente": "Clientes que realizan compras de forma regular.",
    "Nuevo miembro": "Clientes que se han unido recientemente al programa de lealtad.",
    "VIP": "Los clientes más valiosos que reciben beneficios exclusivos.",
    "En riesgo": "Clientes que no han realizado una compra en un tiempo y podrían abandonar el programa.",
};


export default function CustomerManagement() {
    const [customers, setCustomers] = useState<Customer[]>(customersData);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customersData);
    
    const [segmentFilter, setSegmentFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined);

    const [isEditOpen, setEditOpen] = useState(false);
    const [isHistoryOpen, setHistoryOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditOpen(true);
    }
    const handleHistory = (customer: Customer) => {
        setSelectedCustomer(customer);
        setHistoryOpen(true);
    }
    const handleDelete = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteOpen(true);
    }

    const onCustomerUpdate = (updatedCustomer: Customer) => {
        const updatedList = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
        setCustomers(updatedList);
        // También actualizamos la lista filtrada para reflejar el cambio inmediatamente
        const updatedFilteredList = filteredCustomers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
        setFilteredCustomers(updatedFilteredList);
        setEditOpen(false);
    };

    const onCustomerDelete = (customerId: string) => {
        const updatedList = customers.filter(c => c.id !== customerId);
        setCustomers(updatedList);
        const updatedFilteredList = filteredCustomers.filter(c => c.id !== customerId);
        setFilteredCustomers(updatedFilteredList);
        setDeleteOpen(false);
    }

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
    <>
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
        {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="flex flex-col">
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
                <CardFooter className="border-t pt-4">
                    <div className="flex w-full justify-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(customer)}>
                            <Edit className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Editar</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleHistory(customer)}>
                           <History className="h-4 w-4 md:mr-2" />
                           <span className="hidden md:inline">Historial</span>
                        </Button>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(customer)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Eliminar cliente</p>
                            </TooltipContent>
                        </Tooltip>
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

    {/* Dialogs */}
    {selectedCustomer && (
        <>
            <EditCustomerDialog 
                isOpen={isEditOpen} 
                setIsOpen={setEditOpen} 
                customer={selectedCustomer}
                onCustomerUpdate={onCustomerUpdate}
            />
            <ViewHistoryDialog 
                isOpen={isHistoryOpen} 
                setIsOpen={setHistoryOpen} 
                customer={selectedCustomer}
            />
            <DeleteCustomerDialog
                isOpen={isDeleteOpen}
                setIsOpen={setDeleteOpen}
                customer={selectedCustomer}
                onCustomerDelete={onCustomerDelete}
            />
        </>
    )}
    </>
  );
}

    