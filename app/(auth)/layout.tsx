import type React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/authContext";

export const metadata: Metadata = {
  title: "Danu Booking - Book Your Bus Tickets Online",
  description:
    "Book your bus tickets online with Danu booking. Easy, fast, and reliable bus reservations for your journey.",

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
    <AuthProvider blackListRoles={[]}>
      <main>{children}</main>
    </AuthProvider>
  );
}
