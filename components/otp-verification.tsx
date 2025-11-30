"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";

interface OTPVerificationProps {
  contact: string;
  onVerify: (otp: string) => void;
  onBack: () => void;
}

export default function OTPVerification({
  contact,
  onVerify,
  onBack,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setError("");

    // Auto-advance to next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 5).split("");

    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 5) newOtp[index] = digit;
    });

    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[4]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.some((digit) => !digit)) {
      setError("Please enter all 5 digits");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onVerify(otp.join(""));
    }, 1500);
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Verify Your Identity
        </h1>
        <p className="text-muted-foreground">
          We've sent a verification code to <br />
          <span className="font-semibold text-foreground">{contact}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Fields */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-14 h-14 text-center text-2xl font-semibold border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}

        {/* Verify Button */}
        <Button
          type="submit"
          disabled={!isOtpComplete || isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-base font-semibold flex items-center justify-center gap-2"
        >
          {isLoading ? (
            "Verifying..."
          ) : (
            <>
              Verify Code <Check size={18} />
            </>
          )}
        </Button>
      </form>

      {/* Resend Code */}
      <div className="text-center space-y-2">
        <p className="text-muted-foreground text-sm">
          Didn't receive the code?
        </p>
        <button className="text-primary hover:underline font-semibold text-sm">
          Resend Code
        </button>
      </div>
    </div>
  );
}
