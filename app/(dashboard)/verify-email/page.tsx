"use client";

import VerifyEmailClient from "@/components/VerifyEmailClient";

import { Suspense } from "react";

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
