
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
import type { User } from "./user-management";
import { Button } from "@/components/ui/button";

interface DeactivateUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
  onConfirm: (userId: string) => void;
}

export function DeactivateUserDialog({
  isOpen,
  setIsOpen,
  user,
  onConfirm,
}: DeactivateUserDialogProps) {
  const isActivating = user.status === 'Inactivo';
  const title = isActivating ? "¿Activar usuario?" : "¿Estás seguro?";
  const description = isActivating 
    ? `Esto restaurará el acceso para ${user.name} a la plataforma.`
    : `Esta acción revocará temporalmente el acceso para ${user.name}. Aún podrá ser reactivado más tarde.`;
  const actionText = isActivating ? "Sí, activar usuario" : "Sí, desactivar usuario";

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            asChild
            onClick={() => onConfirm(user.id)}
          >
            <Button variant={isActivating ? 'default' : 'destructive'}>{actionText}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
