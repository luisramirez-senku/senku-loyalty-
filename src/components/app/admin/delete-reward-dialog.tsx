
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
import type { Reward } from "./reward-management";
import { Button } from "@/components/ui/button";

interface DeleteRewardDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  reward: Reward;
  onDelete: (rewardId: string) => void;
}

export function DeleteRewardDialog({
  isOpen,
  setIsOpen,
  reward,
  onDelete,
}: DeleteRewardDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la recompensa{" "}
            <span className="font-semibold">{reward.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={() => onDelete(reward.id)}>
              Sí, eliminar recompensa
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
