"use client";
import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/app/globals.css";
import { AuthProtector } from "@/lib/authProtector";
import { AuthProvider } from "@/lib/authContext";
import Sidebar from "@/components/SuperAdminSideBar";
import { useState } from "react";
import AvatarHero from "@/components/HeroAvatar";
import QueryProvider from "@/components/QueryProvide";

// export const metadata: Metadata = {
//   title: "Danu Booking - Book Your Bus Tickets Online",
//   description:
//     "Book your bus tickets online with Danu Booking. Easy, fast, and reliable bus reservations for your journey.",

//   icons: {
//     icon: [
//       {
//         url: "/icon-light-32x32.png",
//         media: "(prefers-color-scheme: light)",
//       },
//       {
//         url: "/icon-dark-32x32.png",
//         media: "(prefers-color-scheme: dark)",
//       },
//       {
//         url: "/icon.svg",
//         type: "image/svg+xml",
//       },
//     ],
//     apple: "/apple-icon.png",
//   },
// };

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider
          blackListRoles={["passenger", "agent_admin", "operator-admin"]}
        >
          <QueryProvider>
            <div className="min-h-screen w-full flex flex-col md:flex-row">
              <aside className="w-full md:w-64 md:min-h-screen border-r border-gray-300">
                <Sidebar />
              </aside>
              <div className="md:flex md:flex-col w-full h-full">
                <div className="h-12 w-full hidden md:flex md:flex-row-reverse px-4 py-3">
                  <AvatarHero />
                </div>
                <main className="flex-1">{children}</main>
              </div>
            </div>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
