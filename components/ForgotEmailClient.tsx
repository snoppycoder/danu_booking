"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { authAPI } from "@/app/api/api";

export default function EmailPasswordExtractorClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Extract token from URL and validate on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("No reset token provided. Invalid or expired link.");
        setLoading(false);
        return;
      }

      try {
        // Call the forgot password API with the token
        const result = await authAPI.forgotPassword(token);
        console.log("Token validated:", result);
        setLoading(false);
      } catch (err) {
        setError(
          "Invalid or expired reset token. Please request a new password reset.",
        );
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

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
      // Here you would typically call an API to reset the password
      // const result = await authApi.resetPassword(token, newPassword);
      console.log("Password reset with token:", token);
      setSuccess(true);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md p-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-center">Loading...</h1>
            <p className="text-center text-muted-foreground">
              Validating your reset token...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md p-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-center">Reset Password</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <Button asChild className="w-full">
              <a href="/">Go Home</a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
              <a href="/login">Go to Login</a>
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

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
