"use client";

import {
  Bus,
  Calendar,
  Home,
  Users,
  Settings,
  ScanFace,
  Ticket,
  DollarSign,
  ChartBar,
  TrendingUp,
  TicketCheck,
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

const menuItems = [
  {
    title: "Ticket Booking",
    url: "/operator-agent/ticket-booking",
    icon: Ticket,
  },
  {
    title: "Booked Tickets",
    url: "/operator-agent/booked",
    icon: TicketCheck,
  },
  {
    title: "Refund List",
    url: "/operator-agent/refund-list",
    icon: DollarSign,
  },
  {
    title: "Report",
    url: "/operator-agent/report",
    icon: TrendingUp,
  },
];

export function OperatorAgentSideBar() {
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2 text-xl font-bold lg:text-2xl">
          Danu Booking
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
