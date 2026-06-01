"use client";

import TicketSearch from "@/components/TicketSearchClient";
import { Suspense, useState } from "react";

// import { useAuth } from "@/lib/authContext";

export default function TVN() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex justify-center items-center">
          Loading...
        </div>
      }
    >
      <TicketSearch />
    </Suspense>
  );
}
