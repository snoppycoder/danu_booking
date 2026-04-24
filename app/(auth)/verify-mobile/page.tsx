"use client";

import {
  useState,
  useEffect,
  useRef,
  FormEvent,
  KeyboardEvent,
  ClipboardEvent,
  Suspense,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import VerifyMobileClient from "@/components/VerifyMobileClient";
// Import your API here. Example:
// import { authAPI } from "@/lib/api";

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
