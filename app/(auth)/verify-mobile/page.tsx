"use client";

import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import VerifyMobileClient from "@/components/VerifyMobileClient";
export default function VerifyMobilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full w-full flex justify-center items-center">
          {" "}
          <Spinner />
        </div>
      }
    >
      <VerifyMobileClient />
    </Suspense>
  );
}
