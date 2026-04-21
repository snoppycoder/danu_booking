"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ForgotPasswordFormProps {
  // FIXED: Now passes the type back to the parent
  onSubmit: (contact: string, type: "email" | "phone") => void;
}

export default function ForgotPasswordForm({
  onSubmit,
}: ForgotPasswordFormProps) {
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!contact.trim()) {
      setError(`Please enter a valid ${contactType}`);
      return;
    }

    if (contactType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact)) {
        setError("Please enter a valid email address");
        return;
      }
    } else {
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(contact.replace(/\D/g, ""))) {
        setError("Please enter a valid phone number");
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // FIXED: Pass both values
      onSubmit(contact, contactType);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
        <p className="text-muted-foreground">
          Enter your email or phone number to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Type Selector */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setContactType("email");
              setContact("");
              setError("");
            }}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 font-medium ${
              contactType === "email"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary"
            }`}
          >
            <Mail size={20} />
            Email
          </button>
          <button
            type="button"
            onClick={() => {
              setContactType("phone");
              setContact("");
              setError("");
            }}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 font-medium ${
              contactType === "phone"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary"
            }`}
          >
            <Phone size={20} />
            Phone Number
          </button>
        </div>

        {/* Input Field */}
        <div>
          <Input
            type={contactType === "email" ? "email" : "tel"}
            placeholder={
              contactType === "email"
                ? "Enter your email"
                : "Enter your phone number"
            }
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              setError("");
            }}
            className="h-12 text-base"
          />
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold flex items-center justify-center gap-2"
        >
          {isLoading ? "Sending..." : "Continue"} <ArrowRight size={18} />
        </Button>
      </form>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
