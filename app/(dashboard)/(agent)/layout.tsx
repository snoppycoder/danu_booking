"use client";
import type React from "react";
import "@/app/globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";

import { AuthProvider } from "@/lib/authContext";
import AvatarHero from "@/components/HeroAvatar";
import { AgentSideBar } from "@/components/AgentSideBar";

export default function AgentDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider blackListRoles={["operator_admin", "passenger"]}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AgentSideBar />
          <main className="relative flex flex-col flex-1">
            <div className="absolute top-0 right-0 z-50 w-full flex flex-row-reverse px-4 py-3 border-b border-gray-300 bg-white">
              <AvatarHero />
            </div>
            <div className="pt-14">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
