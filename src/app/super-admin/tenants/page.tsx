import TenantManagement from "@/components/app/super-admin/tenant-management";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function TenantsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes (Inquilinos)</h2>
          <p className="text-muted-foreground">
            Administre, supervise y añada nuevos negocios a su plataforma.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Cliente
            </Button>
        </div>
      </div>
      <TenantManagement />
    </div>
  );
}
