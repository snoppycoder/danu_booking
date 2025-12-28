"use client";

import { Bus, Calendar, Home, Users, Settings } from "lucide-react";
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

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Trip Management",
    url: "/operator/trips",
    icon: Bus,
  },
  {
    title: "Schedules",
    url: "/schedules",
    icon: Calendar,
  },
  {
    title: "Drivers",
    url: "/operator/drivers",
    icon: Users,
  },
];

export function AppSidebar() {
  const path = usePathname();
  const [active, setActive] = useState("");
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2 text-xl font-bold lg:text-2xl">
          {/* <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Bus className="size-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              FleetOps
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Bus Management
            </span>
          </div> */}
          Danu Booking
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel className=" mb-8  px-6 text-xs uppercase tracking-wider text-sidebar-foreground/50">
            
          </SidebarGroupLabel> */}
          <SidebarGroupContent className="mt-8">
            <SidebarMenu className="gap-5">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-6"
                    >
                      <item.icon className="size-4 " />
                      <span className="text-base font-semibold">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
