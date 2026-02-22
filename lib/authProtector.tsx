"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, getRefreshToken } from "./auth";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { refresh } from "next/cache";
import { authAPI } from "@/app/api/api";

interface AuthProtectorProps {
  children: ReactNode;
}

export const AuthProtector = ({ children }: AuthProtectorProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchAccessToken = async () => {
      const refresh_token = (await getRefreshToken()) || "";

      setToken(refresh_token);

      if (refresh_token.trim().length == 0 || !refresh_token) {
        console.log("It is a falsy value");
        // setLoading(false);
      } else {
        setLoading(false);
      }
    };
    fetchAccessToken();
  }, [router]);

  if (loading && token.trim().length == 0) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};
