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
import VerifyMobileClient from "@/components/VerifyMobileClient";
// Import your API here. Example:
// import { authAPI } from "@/lib/api";

export default function VerifyMobilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Fetch phone number from URL or LocalStorage on mount
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

  // 2. Handle OTP input changes
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take only the last character if they try to type multiple
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 3. Handle Backspace navigation
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 4. Handle Pasting a full code
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
      // NOTE: Replace with your actual authAPI import
      // const response = await authAPI.verifyPhone(phone, code);

      // Simulating API call for demonstration
      await new Promise((res) => setTimeout(res, 1500));
      console.log("Verified:", { phone, code });

      // Success! Redirect user to dashboard or next step
      // router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid verification code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-full w-full flex justify-center items-center">
          {" "}
          <Spinner />
        </div>
      }
    >
      <VerifyMobileClient />
    </Suspense>
  );
}
