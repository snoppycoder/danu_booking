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
import { AgentSideBar } from "@/components/AgentSideBar";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider blackListRoles={[]}>
      <main className="min-h-screen relative">
        <div className="pt-14">{children}</div>
      </main>
    </AuthProvider>
  );
}
