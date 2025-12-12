"use client";

import { authAPI } from "@/app/api/api";
import ForgotPasswordForm from "@/components/forgot-password-form";
import OTPVerification from "@/components/otp-verification";
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
          <OTPVerification
            contact={contact}
            onVerify={handleOTPVerify}
            onBack={() => setStep("email")}
          />
        )}
      </div>
    </main>
  );
}
