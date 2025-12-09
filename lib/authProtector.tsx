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
      const refresh_token = (await getRefreshToken()) || "";

      if (!refresh_token) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };
    fetchAccessToken();
  }, [router]);

  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  return <>{children}</>;
};
