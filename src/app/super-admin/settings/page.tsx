import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configuración de SaaS</h2>
        <p className="text-muted-foreground">
          Administre la configuración global de su plataforma.
        </p>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>Próximamente</CardTitle>
            <CardDescription>
                Este espacio estará dedicado a la configuración de planes de suscripción, integraciones de pago, configuraciones de marca blanca y más.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">Actualmente no hay configuraciones para modificar.</p>
        </CardContent>
      </Card>
    </div>
  );
}
