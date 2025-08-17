
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "./user-management";

interface AddEditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User | null;
  onSave: (user: User) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  email: z.string().email("Debe ser un correo electrónico válido."),
  role: z.enum(["Cajero", "Gerente", "Admin"], {
    required_error: "Se requiere un rol.",
  }),
});

export function AddEditUserDialog({
  isOpen,
  setIsOpen,
  user,
  onSave,
}: AddEditUserDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const isEditing = !!user;

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? undefined,
      });
    }
  }, [isOpen, user, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const initials = values.name.split(' ').map(n => n[0]).join('');
    onSave({
        ...(user || { id: '', status: 'Activo', lastLogin: 'Nunca', initials: ''}),
        ...values,
        initials,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Usuario" : "Agregar Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {isEditing 
                ? "Realiza cambios en el perfil del usuario." 
                : "Complete los detalles para crear una nueva cuenta de usuario."
            }
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
                    <Input placeholder="Ej: John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Ej: user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar un rol" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Cajero">Cajero</SelectItem>
                            <SelectItem value="Gerente">Gerente</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit">{isEditing ? "Guardar Cambios" : "Crear Usuario"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
