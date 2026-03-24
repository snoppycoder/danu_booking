"use client";
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { AuthProtector } from "@/lib/authProtector";
import { AuthProvider, useAuth } from "@/lib/authContext";
import Sidebar from "@/components/SuperAdminSideBar";
import { useState } from "react";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
  const [isNavbarLoaded, setIsNavbarLoaded] = useState(false);
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider blackListRoles={[]}>
          <Navbar
            initalPath={[
              { href: "/passenger", label: "Home" },
              // { href: "/passenger/bookings", label: "Bookings" },
              { href: "/passenger/about-us", label: "About Us" },
              { href: "/passenger/contact", label: "Contact" },
            ]}
            onLoaded={() => setIsNavbarLoaded(true)}
          />
          {isNavbarLoaded ? (
            // <AuthProtector>
            <main>{children}</main>
          ) : (
            // </AuthProtector>
            <div className="p-4"></div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
