"use client";

import TicketVerificationClient from "@/components/TicketVerifyClient";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function TicketVerification() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner />
        </div>
      }
    >
      <TicketVerificationClient />
    </Suspense>
  );
}
