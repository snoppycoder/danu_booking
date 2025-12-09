"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";
import { authAPI } from "@/app/api/api";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { decodeJWT, setAuthCookies } from "@/lib/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const route = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    // first format the phone number to E.164 format if needed
    // api call
    e.preventDefault();
    if (!phone || !password) {
      toast.warning("Enter every field");
      return;
    }
    try {
      const response = await authAPI.login(
        phone.trim().toLowerCase(),
        password,
        checked,
        "superadmin"
      );
      if (response) {
        await setAuthCookies(response);
        const decoded = await decodeJWT(response.access_token);
        toast.success("You have successfully Logged In");
        console.log(decoded);

        if (decoded.roles.includes("passenger")) {
          console.log(decoded.roles);
          route.replace("/passenger");
        } else {
          route.replace("/superadmin");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.warning(error.response?.data.detail);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 py-12">
        <Toaster richColors position="top-right" theme="system"></Toaster>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-teal-600 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your Danu Booking account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
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
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
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
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value={checked ? "yes" : "no"}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="rounded border-gray-300 accent-teal-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors mt-6"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-coral-600 hover:text-coral-700 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
