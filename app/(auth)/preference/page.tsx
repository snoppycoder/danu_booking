"use client";

import { authAPI } from "@/app/api/api";

import ForgotPasswordForm from "@/components/forgot-password-form";
import OTPVerification from "@/components/otp-verification";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [contact, setContact] = useState("");

  const handleEmailSubmit = async (identifer: string) => {
    const res = await authAPI.forgotPassword(identifer);
    console.log(res);
    setContact(identifer);
    setStep("otp");
  };

  const handleOTPVerify = (otp: string) => {
    console.log("OTP verified:", otp, "for contact:", contact);
    // Handle successful verification here
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "email" ? (
          <ForgotPasswordForm onSubmit={handleEmailSubmit} />
        ) : (
          // <OTPVerification
          //   contact={contact}
          //   onVerify={handleOTPVerify}
          //   onBack={() => setStep("email")}
          // />
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
