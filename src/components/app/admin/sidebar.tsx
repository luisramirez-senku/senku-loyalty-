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
  Megaphone,
  UserCog,
  LogOut,
  Settings,
} from "lucide-react";
import Logo from "@/components/app/shared/logo";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/admin", label: "Panel", icon: BarChart2 },
  { href: "/admin/customers", label: "Clientes", icon: Users },
  { href: "/admin/programs", label: "Programas", icon: Award },
  { href: "/admin/offers", label: "Ofertas", icon: Gift },
  { href: "/admin/promotions", label: "Promociones", icon: Megaphone },
  { href: "/admin/users", label: "Usuarios", icon: UserCog },
];

export function AdminSidebar() {
  const pathname = usePathname();

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
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Configuración">
              <Settings />
              <span>Configuración</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/" legacyBehavior passHref>
              <SidebarMenuButton tooltip="Cerrar sesión">
                <LogOut />
                <span>Cerrar sesión</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
