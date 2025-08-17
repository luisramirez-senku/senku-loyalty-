"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Workflow, ChevronRight, Zap, Users, Send, ToggleRight, ToggleLeft } from "lucide-react";
import { CreateAutomationSheet } from "./create-automation-sheet";
import { Badge } from "@/components/ui/badge";

const automations = [
  {
    id: "auto_1",
    name: "Campaña de reactivación para clientes en riesgo",
    trigger: {
      type: "Segmento de cliente",
      value: "En riesgo",
    },
    action: {
      type: "Enviar notificación push",
      value: "Oferta de 'Te extrañamos'",
    },
    status: "Activa",
  },
   {
    id: "auto_2",
    name: "Bienvenida a nuevos miembros",
    trigger: {
      type: "Segmento de cliente",
      value: "Nuevo miembro",
    },
    action: {
      type: "Enviar notificación push",
      value: "Oferta de primer café gratis",
    },
    status: "Activa",
  },
  {
    id: "auto_3",
    name: "Recompensa a compradores frecuentes",
    trigger: {
      type: "Segmento de cliente",
      value: "Comprador frecuente",
    },
    action: {
      type: "Enviar notificación push",
      value: "Doble Puntos",
    },
    status: "Inactiva",
  },
];

const TriggerIcon = ({ type }: { type: string }) => {
    if (type === 'Segmento de cliente') {
        return <Users className="h-5 w-5 text-muted-foreground" />
    }
    return <Zap className="h-5 w-5 text-muted-foreground" />;
}

const ActionIcon = ({ type }: { type: string }) => {
    if (type === 'Enviar notificación push') {
        return <Send className="h-5 w-5 text-muted-foreground" />
    }
    return <Zap className="h-5 w-5 text-muted-foreground" />;
}


export default function AutomationManagement() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Automatizaciones</h2>
            <p className="text-muted-foreground">
              Cree flujos de trabajo que se ejecutan automáticamente en función de los activadores.
            </p>
          </div>
          <Button onClick={() => setSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Automatización
          </Button>
        </div>
        
        <div className="space-y-4">
            {automations.map((automation) => (
                <Card key={automation.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle>{automation.name}</CardTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant={automation.status === 'Activa' ? 'default' : 'outline'}>
                                    {automation.status}
                                </Badge>
                                <Button variant="outline" size="icon">
                                    {automation.status === 'Activa' ? <ToggleRight className="h-4 w-4"/> : <ToggleLeft className="h-4 w-4"/> }
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <div className="flex items-center gap-3 p-3 border rounded-md bg-background flex-1">
                           <TriggerIcon type={automation.trigger.type} />
                            <div>
                                <p className="text-sm text-muted-foreground">Disparador</p>
                                <p className="font-semibold">{automation.trigger.value}</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0"/>
                        <div className="flex items-center gap-3 p-3 border rounded-md bg-background flex-1">
                            <ActionIcon type={automation.action.type} />
                            <div>
                                <p className="text-sm text-muted-foreground">Acción</p>
                                <p className="font-semibold">{automation.action.value}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
      <CreateAutomationSheet isOpen={isSheetOpen} setIsOpen={setSheetOpen} />
    </>
  );
}
