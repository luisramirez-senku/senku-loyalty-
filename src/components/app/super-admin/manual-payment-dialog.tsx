
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tenant } from "./tenant-management";

type TenantPlan = "Gratis" | "Pro" | "Esencial" | "Crecimiento" | "Empresarial";
type TenantStatus = "Activo" | "Prueba" | "Cancelado" | "Suspendido";

interface ManualPaymentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tenant: Tenant | null;
  onSave: (tenantId: string, newPlan: TenantPlan, newStatus: TenantStatus) => void;
}

const formSchema = z.object({
  plan: z.enum(["Gratis", "Pro", "Esencial", "Crecimiento", "Empresarial"], {
    required_error: "Se requiere un plan.",
  }),
});

export function ManualPaymentDialog({
  isOpen,
  setIsOpen,
  tenant,
  onSave,
}: ManualPaymentDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (tenant) {
      form.reset({
        plan: tenant.plan,
      });
    }
  }, [tenant, form]);

  if (!tenant) return null;

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(tenant!.id, values.plan, "Activo");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Pago Manual</DialogTitle>
          <DialogDescription>
            Actualice el plan para{" "}
            <span className="font-semibold">{tenant.name}</span> después de recibir un pago manual.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nuevo Plan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar un plan" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Esencial">Esencial</SelectItem>
                            <SelectItem value="Crecimiento">Crecimiento</SelectItem>
                            <SelectItem value="Empresarial">Empresarial</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {/* Future fields like expiration date or notes can be added here */}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit">Actualizar Plan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
