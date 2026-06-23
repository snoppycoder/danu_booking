"use client";
import type React from "react";
import GuestNavBar from "@/components/GuestNavBar";

export default function GuestDashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GuestNavBar />

      <main>{children}</main>
    </>
  );
}
