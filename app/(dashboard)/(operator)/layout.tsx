"use client";
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/OperatorSidebar";
import { AuthProvider } from "@/lib/authContext";
import AvatarHero from "@/components/HeroAvatar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider blackListRoles={["agent", "passenger"]}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
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
