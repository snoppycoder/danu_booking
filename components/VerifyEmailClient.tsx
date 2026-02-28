"use client";

import { authAPI } from "@/app/api/api";
import { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";

type VerificationState =
  | "verifying"
  | "success"
  | "resent"
  | "expired"
  | "error";

export default function VerifyEmailClient() {
  const searchParam = useSearchParams();
  const token = searchParam.get("token") ?? "";
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [state, setState] = useState<VerificationState>("verifying");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleResendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.resendEmailVerification(email);
      setErrorMessage("");
      setEmail("");
      setState("resent");
    } catch (error) {
      if (isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.detail || "Failed to resend verification email",
        );
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setState("error");
        setErrorMessage("Invalid or missing verification token");
        return;
      }

      try {
        await authAPI.verifyEmail(token);
        setState("success");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error) {
        if (isAxiosError(error)) {
          if (
            error.response?.data &&
            error.response?.data.detail.includes("expired")
          ) {
            setState("expired");
          } else {
            setState("error");
            setErrorMessage(
              error.response?.data?.detail || "Verification failed",
            );
          }
        } else {
          setState("error");
          setErrorMessage("An error occurred during verification");
        }
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        {state === "verifying" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-2xl">Verifying Email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            </CardContent>
          </Card>
        )}

        {state === "resent" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                Verification Email Sent
              </CardTitle>
              <CardDescription>
                A new verification link has been sent to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              Please check your inbox and spam folder if you don’t see the
              email.
            </CardContent>
          </Card>
        )}
        {state === "success" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                Email Verified Successfully
              </CardTitle>
              <CardDescription>
                Your email has been successfully verified. Redirecting you to
                login...
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {state === "expired" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <CardTitle className="text-2xl">Link Expired</CardTitle>
              <CardDescription>
                Your verification link has expired. Request a new one below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleResendLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-background"
                  />
                </div>
                {errorMessage && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Resend Verification Email"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {state === "error" && (
          <Card className="border-0 shadow-lg border-destructive/50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl">Verification Failed</CardTitle>
              <CardDescription>
                {errorMessage || "We couldn't verify your email address"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                Return to Login
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
