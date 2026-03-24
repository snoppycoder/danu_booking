"use client";

import {
  Bus,
  Calendar,
  Home,
  Users,
  Settings,
  ScanFace,
  DollarSign,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TrendingUp } from "@mui/icons-material";

const menuItems = [
  {
    title: "Dashboard",
    url: "/operator",
    icon: Home,
  },
  {
    title: "Trip Management",
    url: "/operator/trips",
    icon: Bus,
  },
  {
    title: "Refund Management",
    url: "/operator/refunds",
    icon: DollarSign,
  },
  {
    title: "Agents",
    url: "/operator/agents",
    icon: Users,
  },

  {
    title: "Transaction Management",
    url: "/operator/transactions",
    icon: Users,
  },
  {
    title: "Report",
    url: "/operator/report",
    icon: TrendingUp,
  },
  {
    title: "Drivers",
    url: "/operator/drivers",
    icon: Users,
  },
  {
    title: "KYC Documents",
    url: "/operator/kyc",
    icon: ScanFace,
  },
];

export function AppSidebar() {
  const path = usePathname();

  const [active, setActive] = useState("");
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6">
        <div className="flex w-full py-0 justify-center cursor-pointer">
          <Link href={"/operator"}>
            <img src="/logo.png" className="py-0 h-26 w-auto" alt="Danu logo" />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel className=" mb-8  px-6 text-xs uppercase tracking-wider text-sidebar-foreground/50">
            
          </SidebarGroupLabel> */}
          <SidebarGroupContent className="mt-8">
            <SidebarMenu className="gap-5">
              {menuItems.map((item) => {
                const isActive = path === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 px-6"
                      >
                        <item.icon className="size-4" />
                        <span className="text-base font-semibold">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-6"
                  >
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
