"use client";
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { AuthProtector } from "@/lib/authProtector";
import { AuthProvider, useAuth } from "@/lib/authContext";
import Sidebar from "@/components/SuperAdminSideBar";
import QueryProvider from "@/components/QueryProvide";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider blackListRoles={[]}>
            <AuthProtector>
              <main>{children}</main>
            </AuthProtector>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
