import TenantManagement from "@/components/app/super-admin/tenant-management";

export default function TenantsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes (Inquilinos)</h2>
          <p className="text-muted-foreground">
            Una lista de todos los negocios que usan su plataforma.
          </p>
        </div>
      </div>
      <TenantManagement />
    </div>
  );
}
