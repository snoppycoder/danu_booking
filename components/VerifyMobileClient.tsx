"use client";

import {
  useState,
  useEffect,
  useRef,
  FormEvent,
  KeyboardEvent,
  ClipboardEvent,
  Suspense,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { authAPI } from "@/app/api/api";
import { toast } from "sonner";
import { isAxiosError } from "axios";
// Import your API here. Example:
// import { authAPI } from "@/lib/api";

export default function VerifyMobileClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const urlPhone = searchParams.get("phone");
    const localPhone =
      typeof window !== "undefined"
        ? localStorage.getItem("phone_number")
        : null;

    if (urlPhone) {
      setPhone(urlPhone);
    } else if (localPhone) {
      setPhone(localPhone);
    } else {
      setError("No phone number found. Please sign up again.");
    }
  }, [searchParams]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take only the last character if they try to type multiple
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.some((char) => isNaN(Number(char)))) return;

    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus the last filled input
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // 5. Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.verifyPhone(phone, code);

      localStorage.setItem("phone_number", "");

      toast.success(
        "Successfully verified your phone number, redirecting you to the login page",
      );
      setInterval(() => {
        router.replace("/login");
      }, 3000);
    } catch (err: any) {
      if (isAxiosError(err)) {
        setError(
          err?.response?.data?.message ||
            err.response?.data.detail ||
            "Invalid verification code. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-6 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Verify your phone
          </h1>
          <p className="text-slate-500 text-sm">
            We've sent a 6-digit verification code to <br />
            <span className="font-semibold text-slate-800">
              {phone || "your device"}
            </span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                // @ts-ignore
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{1}"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold rounded-xl border transition-all duration-200 outline-none
                  ${
                    digit
                      ? "border-primary/90 bg-blue-50/30 text-primary"
                      : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300"
                  } 
                  focus:border-primary/90 focus:ring-4 focus:ring-blue-500/20`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join("").length !== 6 || !phone}
            className={`w-full py-4 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center
              ${
                isLoading || otp.join("").length !== 6 || !phone
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-primary hover:bg-primary hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
              }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        {/* Footer / Resend */}
        <div className="mt-8 text-center text-sm text-slate-500">
          Didn't receive the code?{" "}
          <button
            type="button"
            className=" text-primary font-semibold hover:underline transition-colors"
            onClick={async () => {
              await authAPI.resendPhoneOTP(phone);
            }}
          >
            Resend SMS
          </button>
        </div>
      </div>
    </div>
  );
}
