
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Customer } from "./customer-management";
import { Button } from "@/components/ui/button";

interface DeleteCustomerDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  customer: Customer;
  onCustomerDelete: (customerId: string) => void;
}

export function DeleteCustomerDialog({
  isOpen,
  setIsOpen,
  customer,
  onCustomerDelete,
}: DeleteCustomerDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente{" "}
            <span className="font-semibold">{customer.name}</span> y todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={() => onCustomerDelete(customer.id)}>
              Sí, eliminar cliente
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

    