
"use client"

import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/app/admin/sidebar";
// Removed withAuth from here to prevent redirect loop on login page

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <AdminSidebar />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
