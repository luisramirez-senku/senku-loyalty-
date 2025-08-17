
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  AreaChart,
  Building,
  LogOut,
  Settings,
  LifeBuoy,
} from "lucide-react";
import Logo from "@/components/app/shared/logo";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const menuItems = [
  { href: "/super-admin", label: "Panel", icon: AreaChart },
  { href: "/super-admin/tenants", label: "Clientes", icon: Building },
  { href: "/super-admin/settings", label: "Configuración", icon: Settings },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-lg">SaaS Control</span>
          <div className="flex-1" />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && (item.href.length > '/super-admin'.length ? pathname.startsWith(item.href) : pathname === item.href) }
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton tooltip="Soporte">
              <LifeBuoy />
              <span>Soporte</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar sesión">
                <LogOut />
                <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
