

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
  FormDescription,
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
import type { Customer } from "./customer-management";
import { customerSegments } from "./customer-management";

type CustomerTier = "Oro" | "Plata" | "Bronce";

interface EditCustomerDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  customer: Customer | null; // Can be null for adding
  onSave: (data: Omit<Customer, 'id' | 'initials' | 'joined'> & { id?: string, password?: string }) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  email: z.string().email("Debe ser un correo electrónico válido."),
  password: z.string().optional(),
  tier: z.enum(["Oro", "Plata", "Bronce"]),
  points: z.coerce.number().min(0, "Los puntos no pueden ser negativos."),
  segment: z.string().min(1, "El segmento es requerido."),
});

export function EditCustomerDialog({
  isOpen,
  setIsOpen,
  customer,
  onSave,
}: EditCustomerDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const isEditing = !!customer;

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: customer?.name ?? "",
        email: customer?.email ?? "",
        password: "",
        tier: customer?.tier ?? "Bronce",
        points: customer?.points ?? 0,
        segment: customer?.segment ?? "Nuevo miembro",
      });
    }
  }, [isOpen, customer, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isEditing && !values.password) {
        form.setError("password", { type: "manual", message: "La contraseña es requerida para nuevos clientes." });
        return;
    }
    onSave({
      id: customer?.id,
      ...values,
      segment: values.segment as Customer['segment'],
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Cliente" : "Agregar Nuevo Cliente"}</DialogTitle>
          <DialogDescription>
            {isEditing 
                ? "Realiza cambios en el perfil del cliente." 
                : "Completa los detalles para crear un nuevo cliente."
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
            {!isEditing && (
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                        El cliente usará esto para iniciar sesión.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="tier"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nivel</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar nivel" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Bronce">Bronce</SelectItem>
                                <SelectItem value="Plata">Plata</SelectItem>
                                <SelectItem value="Oro">Oro</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="points"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Puntos</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="segment"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Segmento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar un segmento" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {customerSegments.map(segment => (
                                <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit">{isEditing ? "Guardar Cambios" : "Crear Cliente"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    
