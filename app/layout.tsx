import type React from "react";
import type { Metadata } from "next";

import "@/app/globals.css";
import QueryProvider from "@/components/QueryProvide";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Danu Booking - Intercity Bus Ticket Management System",
  description:
    "Book your bus tickets online with Danu Booking. Easy, fast, and reliable bus reservations for your journey.",

  icons: {
    icon: [
      // {
      //   url: "/icon-light-32x32.png",
      //   media: "(prefers-color-scheme: light)",
      // },
      // {
      //   url: "/icon-dark-32x32.png",
      //   media: "(prefers-color-scheme: dark)",
      // },
      {
        url: "/favicon.ico",
        // type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`font-sans antialiased`}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
