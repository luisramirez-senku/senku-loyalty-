import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "@/components/app/super-admin/sidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SuperAdminSidebar />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
