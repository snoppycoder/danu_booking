"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, getRefreshToken } from "./auth";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

interface AuthProtectorProps {
  children: ReactNode;
}

export const AuthProtector = ({ children }: AuthProtectorProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token_ = (await getRefreshToken()) || "";
      console.log("token here", token_);

      if (!token_) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };
    fetchAccessToken();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
};
