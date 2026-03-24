"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { authAPI } from "@/app/api/api";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";

export default function EmailPasswordExtractorClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await authAPI.resetPassword("email", newPassword, token ?? "");
      console.log("Password reset with token:", token);
      setSuccess(true);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // if (error && !success) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-background">
  //       <Card className="w-full max-w-md p-8">
  //         <div className="space-y-4">
  //           <h1 className="text-2xl font-bold text-center">Reset Password</h1>
  //           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
  //             <p className="text-red-800 text-sm">{error}</p>
  //           </div>
  //           <Button asChild className="w-full">
  //             <Link href="/guest">Go Home</Link>
  //           </Button>
  //         </div>
  //       </Card>
  //     </div>
  //   );
  // }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md p-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-center">Success!</h1>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                Your password has been reset successfully. You can now log in
                with your new password.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
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
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={submitting}
              className="pr-10" // add some padding for the button
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative w-full">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
              className="pr-10" // add some padding for the button
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-1/2 right-2 border-0 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
