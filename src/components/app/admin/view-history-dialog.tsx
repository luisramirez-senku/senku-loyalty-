
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Customer } from "./customer-management";
import { Badge } from "@/components/ui/badge";

interface ViewHistoryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  customer: Customer;
}

export function ViewHistoryDialog({
  isOpen,
  setIsOpen,
  customer,
}: ViewHistoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Historial de {customer.name}</DialogTitle>
          <DialogDescription>
            Una lista de las transacciones y actividades de lealtad recientes del cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            {customer.history && customer.history.length > 0 ? (
                <ScrollArea className="h-72">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="text-right">Puntos</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customer.history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.date}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={item.points > 0 ? "default" : "destructive"}>
                                        {item.points > 0 ? `+${item.points.toLocaleString()}` : item.points.toLocaleString()}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            ) : (
                <div className="text-center text-sm text-muted-foreground py-16">
                    Este cliente no tiene historial de transacciones.
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

    