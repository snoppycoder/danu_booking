"use client";
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/OperatorSidebar";
import { AuthProvider } from "@/lib/authContext";
import QueryProvider from "@/components/QueryProvide";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider blackListRoles={["agent", "passenger"]}>
          <QueryProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1">{children}</main>
              </div>
            </SidebarProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
