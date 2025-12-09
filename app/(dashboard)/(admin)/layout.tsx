import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { AuthProtector } from "@/lib/authProtector";
import { AuthProvider } from "@/lib/authContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/sidebar";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Danu Booking - Book Your Bus Tickets Online",
  description:
    "Book your bus tickets online with Danu Booking. Easy, fast, and reliable bus reservations for your journey.",

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider blackListRoles={["passenger", "agent", "operator"]}>
          <AuthProtector>
            <div className="min-h-screen w-full flex flex-col md:flex-row">
              <aside className="w-full md:w-64 md:min-h-screen border-r border-gray-300">
                <Sidebar />
              </aside>
              <main className="flex-1">{children}</main>
            </div>
          </AuthProtector>
        </AuthProvider>
      </body>
    </html>
  );
}
