
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
  BarChart2,
  Users,
  Award,
  Gift,
  Bell,
  UserCog,
  LogOut,
  Settings,
  Workflow,
  Sparkles,
} from "lucide-react";
import Logo from "@/components/app/shared/logo";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const menuItems = [
  { href: "/admin", label: "Panel", icon: BarChart2 },
  { href: "/admin/customers", label: "Clientes", icon: Users },
  { href: "/admin/programs", label: "Programas", icon: Award },
  { href: "/admin/rewards", label: "Recompensas", icon: Gift },
  { href: "/admin/offers", label: "Ofertas", icon: Sparkles },
  { href: "/admin/promotions", label: "Notificaciones Push", icon: Bell },
  { href: "/admin/automations", label: "Automatizaciones", icon: Workflow },
  { href: "/admin/users", label: "Usuarios", icon: UserCog },
];

export function AdminSidebar() {
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
          <span className="font-semibold text-lg">Senku Lealtad</span>
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
                isActive={pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')}
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
            <SidebarMenuButton asChild isActive={pathname === '/admin/settings'} tooltip="Configuración">
              <Link href="/admin/settings">
                <Settings />
                <span>Configuración</span>
              </Link>
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
