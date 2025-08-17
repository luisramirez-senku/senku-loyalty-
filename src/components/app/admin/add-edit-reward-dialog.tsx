
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Reward } from "./reward-management";

interface AddEditRewardDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  reward: Reward | null;
  onSave: (reward: Omit<Reward, 'id'> & { id?: string }) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
  cost: z.coerce.number().min(1, "El costo debe ser mayor que 0."),
});

export function AddEditRewardDialog({
  isOpen,
  setIsOpen,
  reward,
  onSave,
}: AddEditRewardDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      cost: 0,
    }
  });

  const isEditing = !!reward;

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: reward?.name ?? "",
        description: reward?.description ?? "",
        cost: reward?.cost ?? 0,
      });
    }
  }, [isOpen, reward, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
        id: reward?.id,
        ...values,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Recompensa" : "Agregar Nueva Recompensa"}</DialogTitle>
          <DialogDescription>
            Complete los detalles para {isEditing ? "actualizar" : "crear"} una recompensa.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Café Gratis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Disfruta de cualquier café de tamaño mediano." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo en Puntos</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit">{isEditing ? "Guardar Cambios" : "Crear Recompensa"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
