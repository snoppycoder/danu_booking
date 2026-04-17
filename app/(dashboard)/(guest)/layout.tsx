"use client";
import type React from "react";
import GuestNavBar from "@/components/GuestNavBar";

export default function GuestDashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <GuestNavBar />

        <main>{children}</main>
      </body>
    </html>
  );
}
