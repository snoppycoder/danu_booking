"use client";

import { authAPI } from "@/app/api/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmailClient() {
  const searchParam = useSearchParams();
  const token = searchParam.get("token") ?? "";
  const router = useRouter();
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authAPI.verifyEmail(token);
        router.push("/login"); // redirect after success
      } catch (error) {
        console.error("Verification failed", error);
        router.push("/verification-error");
      }
    };

    verifyEmail();
  }, [token, router]);
  return <div>Redirecting to login...</div>;
}
