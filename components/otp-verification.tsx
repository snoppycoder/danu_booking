"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react"; // FIXED: Removed unused Router
import { authAPI } from "@/app/api/api";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

interface OTPVerificationProps {
  contact: string;
  // FIXED: Removed redundant phone string
  onBack: () => void;
}

export default function OTPVerification({
  contact,
  onBack,
}: OTPVerificationProps) {
  const [stages, setStages] = useState<"otp" | "new_password">("otp");
  const [error, setError] = useState("");

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (stages === "otp") {
      inputRefs.current[0]?.focus();
    }
  }, [stages]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.some((digit) => !digit)) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      setStages("new_password");
    }, 1000);
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await authAPI.resetPassword(
        "phone",
        newPassword,
        undefined,
        contact, // FIXED: Using contact as the phone number payload
        otp.join(""),
      );
      router.replace("/login");
    } catch (err) {
      // FIXED: Logging 'err', not the state variable 'error'
      console.error(err);
      if (isAxiosError(err)) {
        toast.error(
          err.response?.data?.detail ||
            "Failed to reset password. Please try again.",
        );
      }

      setSubmitting(false); // Reset submitting state on error
    }
  };

  async function handleResendOtp(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> {
    event.preventDefault();
    try {
      await authAPI.resendPhoneOTP(contact);
      toast.success("OTP resent successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP. Please try again.");
    }
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      {stages === "otp" && (
        <div className="space-y-6 w-full max-w-md">
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
              {/* FIXED: Escaped quotes */}
              We&apos;ve sent a verification code to <br />
              <span className="font-semibold text-foreground">{contact}</span>
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3">
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
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="w-12 h-14 sm:w-14 sm:h-14 text-center text-2xl font-semibold border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {error && (
              <p className="text-destructive text-sm text-center font-medium">
                {error}
              </p>
            )}

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

          <div className="text-center space-y-2">
            {/* FIXED: Escaped quotes */}
            <p className="text-muted-foreground text-sm">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              className="text-primary hover:underline font-semibold text-sm"
            >
              Resend Code
            </button>
          </div>
        </div>
      )}

      {stages === "new_password" && (
        <Card className="w-full max-w-md p-8 shadow-lg border-0 bg-background/50">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your new password below
              </p>
            </div>

            <div className="relative w-full">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Set New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                disabled={submitting}
                className="pr-10 h-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative w-full">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                disabled={submitting}
                className="pr-10 h-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive text-sm font-medium text-center">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base"
              disabled={submitting}
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
