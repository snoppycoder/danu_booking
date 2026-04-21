"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/app/api/api";

function VerifyMobileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Try to get phone from URL query
    const queryPhone = searchParams.get("phone");
    // 2. Try to get phone from LocalStorage
    const localPhone = localStorage.getItem("phone_number");

    const activePhone = queryPhone || localPhone;

    if (activePhone) {
      setPhone(activePhone);
      // Ensure local storage is synced if it came from the query
      if (queryPhone && queryPhone !== localPhone) {
        localStorage.setItem("phone_number", queryPhone);
      }
    } else {
      toast.error("Phone number not found. Please try registering again.");
      // Optional: router.push('/register');
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Missing phone number");
      return;
    }

    // FIXED: Changed from 6 to 5
    if (otp.length < 5) {
      toast.error("Please enter a valid 5-digit code.");
      return;
    }

    try {
      setIsLoading(true);

      const result = await authAPI.verifyPhone(phone, otp);

      toast.success("Phone verified successfully!");

      // Clear storage after successful verification
      localStorage.removeItem("phone_number");

      // Redirect to dashboard or home
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Invalid verification code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Mask the phone number for privacy (e.g., +1 *** *** 7890)
  const maskedPhone =
    phone.length > 4
      ? `${phone.slice(0, -4).replace(/[0-9]/g, "*")} ${phone.slice(-4)}`
      : phone;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-3 items-center text-center pb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Verify your phone
          </CardTitle>
          {/* FIXED: Changed text from 6-digit to 5-digit */}
          <CardDescription className="text-zinc-500 dark:text-zinc-400 text-base">
            We've sent a 5-digit code to <br />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {maskedPhone || "your phone"}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleVerify}
            className="space-y-8 flex flex-col items-center"
          >
            <div className="flex justify-center w-full">
              <InputOTP
                maxLength={5}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-14 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-lg" />
                </InputOTPGroup>

                <InputOTPGroup>
                  <InputOTPSlot index={3} className="w-12 h-14 text-lg" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* FIXED: Changed disabled condition from 6 to 5 */}
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium transition-all"
              disabled={isLoading || otp.length < 5}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
              Didn't receive a code?{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:underline hover:text-primary/90 disabled:opacity-50"
                disabled={isLoading}
                onClick={() => {
                  toast.success("New code requested!");
                  // Add your resend code API call here
                }}
              >
                Resend
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap in Suspense boundary for Next.js App Router best practices regarding useSearchParams
export default function VerifyMobilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyMobileContent />
    </Suspense>
  );
}
