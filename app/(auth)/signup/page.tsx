"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { authAPI } from "@/app/api/api";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { TermsConditionsModal } from "@/components/TermsAndConditionModal";
import { normalize } from "path";
import { normalizeEthiopianPhone } from "@/lib/common_functions";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const router = useRouter();
  const [onRead, setOnRead] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: onRead,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup attempt:", formData);
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!formData.acceptTerms) {
      toast.error("You must accept the terms and conditions");
      return;
    }
    const cleanedPhone = normalizeEthiopianPhone(formData.phone);

    try {
      const { confirmPassword, acceptTerms, password, ...cleanedFormData } =
        formData;

      const formattedData = {
        ...cleanedFormData,
        password,
        phone: cleanedPhone,
      };
      await authAPI.signup(formattedData);

      toast.success("Account created successfully, please verify your account");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error) {
      if (isAxiosError(error)) {
        if (typeof error.response?.data?.error === "string") {
          console.log(error.response.data.error, "signup error message");
          toast.error(error.response.data.error);
          return;
        }
        const message =
          error.response?.data?.error?.reasons?.[0] ||
          error.response?.data?.error?.message ||
          error.response?.data?.detail?.[0]?.msg;
        console.log(error);
        if (
          (message && message?.includes("String")) ||
          message?.includes("string")
        ) {
          let newMessage = message.replace(
            "String",
            error.response?.data.detail?.[0]?.loc[1],
          );
          !newMessage
            ? message.replace(
                "string",
                error.response?.data.detail?.[0]?.loc[1],
              )
            : message.replace(
                "String",
                error.response?.data.detail?.[0]?.loc[1],
              );
          console.log(
            newMessage,
            error.response?.data.detail?.[0]?.loc[1],
            "after replacement",
          );
          toast.error(newMessage);
          return;
        }
        toast.error(message);
      } else toast.error("Failed to create account");
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <TermsConditionsModal
        setOnRead={() =>
          setFormData((prev) => ({ ...prev, acceptTerms: true }))
        }
        read={onRead}
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-teal-600 mb-2">
                Create Account
              </h1>
              <p className="text-gray-600">
                Join Danu Booking and start booking today
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    // placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address (Optional)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number <span className="text-red-500"> *</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  // placeholder="+2519XXXXXXXX or 09XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password <span className="text-red-500"> *</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password <span className="text-red-500"> *</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <label className="flex items-start mt-4">
                <input
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(
                      "You have to read and review the terms and conditions to proceed",
                    )
                  }
                  onChange={handleChange}
                  disabled
                  className="mt-1 rounded border-gray-300 accent-teal-600"
                  required
                />
                <span className="ml-2 text-sm text-gray-600">
                  I read and agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-teal-600 cursor-pointer hover:text-teal-700 font-medium underline"
                  >
                    Terms & Conditions
                  </button>
                </span>
              </label>

              <Button
                type="submit"
                className="mb-2.5 cursor-pointer bg-primary w-full hover:bg-coral-700 text-white font-semibold py-3 rounded-lg transition-colors mt-6"
              >
                Create Account
              </Button>
            </form>

            <p className="text-center mt-2.5 text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
