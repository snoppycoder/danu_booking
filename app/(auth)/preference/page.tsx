"use client";

import { authAPI } from "@/app/api/api";
import ForgotPasswordForm from "@/components/forgot-password-form";
import OTPVerification from "@/components/otp-verification";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@mui/material";
import { ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PreferencePage() {
  // FIXED: Added "email_sent" state to handle the 3rd UI condition properly
  const [step, setStep] = useState<"form" | "otp" | "email_sent">("form");
  const [contact, setContact] = useState("");
  const router = useRouter();

  // FIXED: Now accepts the type to determine the next step
  const handleFormSubmit = async (
    identifier: string,
    type: "email" | "phone",
  ) => {
    try {
      const res = await authAPI.forgotPassword(identifier);
      console.log(res);

      setContact(identifier);

      // Route based on contact type
      if (type === "phone") {
        setStep("otp");
      } else {
        setStep("email_sent");
      }
    } catch (error) {
      console.error("Failed to send forgot password request", error);
    }
  };

  return (
    <main className="relative min-h-screen bg-linear-to-br from-background to-background flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Button
          variant="text"
          color="inherit"
          className="flex items-center gap-2 normal-case text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
          onClick={() => router.back()}
          startIcon={<ArrowLeft size={20} />}
        ></Button>
      </div>
      <div className="w-full max-w-md">
        {step === "form" && <ForgotPasswordForm onSubmit={handleFormSubmit} />}

        {step === "otp" && (
          <OTPVerification contact={contact} onBack={() => setStep("form")} />
        )}

        {step === "email_sent" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription className="mt-2 text-md">
                We’ve sent a link to reset your password to your email. Open the
                message and follow the instructions to continue.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </main>
  );
}
