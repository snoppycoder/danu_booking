import type React from "react";
import type { Metadata } from "next";

import "@/app/globals.css";
import QueryProvider from "@/components/QueryProvide";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/authContext";

export default function NotificationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthProvider blackListRoles={[]}>{children}</AuthProvider>;
}
