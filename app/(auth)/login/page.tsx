"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Imported Loader2
import { toast, Toaster } from "sonner";
import axios, { isAxiosError } from "axios";
import "@/i18n";
import { useAuth } from "@/lib/authContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const { t } = useTranslation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !password) {
      toast.warning("Enter every field");
      return;
    }

    setIsLoading(true); // Start spinner

    try {
      const response = await login(
        phone.trim().toLowerCase(),
        password,
        checked,
      );
      console.log(response);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data?.error, "errorsssss");
        toast.warning(
          error.response?.data?.error ||
            "Invalid credentials. Please try again.",
        );
      } else if (error instanceof Error) {
        toast.error(
          error.message ||
            "Something went wrong please contact our support team!",
        );
      }
    } finally {
      setIsLoading(false); // Stop spinner regardless of success/fail
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <Toaster richColors position="top-right"></Toaster>
      <div className="w-full max-w-md">
        {/* Animated Border Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all ease-in-out p-[2px] group">
          {/* Spinning Light Background */}
          {/* We use text-primary and currentColor to safely map to your Tailwind primary color */}
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_75%,currentColor)] text-primary opacity-80" />

          {/* Inner Form Card */}
          <div className="relative bg-white rounded-[14px] p-8 w-full z-10">
            <div className="text-center mb-6">
              <img
                src="/logo.png"
                alt="Danu Booking Logo"
                className="mx-auto w-auto h-28 bg-cover"
              />
              <h1 className="text-3xl font-bold text-teal-600 mb-2">
                {t("welcomeBack")}
              </h1>
              <p className="text-gray-600">{t("signIn")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block font-semibold text-sm text-gray-700 mb-2"
                >
                  {t("phoneNumber")}
                </label>
                <input
                  id="phone"
                  placeholder="+251 9XXXXXXXX OR 09XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-semibold text-sm text-gray-700 mb-2"
                >
                  {t("password")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col gap-2 md:flex-row items-start md:items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="rounded border-gray-300 accent-teal-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {t("rememberMe")}
                  </span>
                </label>
                <Link
                  href="/preference"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {t("loading") || "Loading..."}
                  </>
                ) : (
                  t("login")
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center">
                <div className="grow border-t border-gray-200"></div>
                <span className="px-3 text-sm text-gray-600">{t("or")}</span>
                <div className="grow border-t border-gray-200"></div>
              </div>

              <Link
                href="/guest"
                className="block w-full text-center border border-gray-300 hover:border-teal-500 text-gray-700 font-medium py-3 rounded-lg transition-colors"
              >
                {t("continueAsGuest")}
              </Link>
            </form>

            <p className="text-center mt-6 text-gray-600">
              {t("dontHaveAccount")}{" "}
              <Link
                href="/signup"
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                {t("signUp")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
