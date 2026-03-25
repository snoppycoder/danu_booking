"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { setAuthCookies } from "./auth";

import { LoginResponse, UseAuthUser, User } from "./model";
import { authAPI } from "@/app/api/api";
import { usePathname } from "next/navigation";
import { decodeJWT } from "./jwt";

interface AuthContextType {
  user: UseAuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<UseAuthUser | null>>;
  login: (
    identifier: string,
    password: string,
    remember: boolean,
  ) => Promise<LoginResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  blackListRoles,
}: {
  children: ReactNode;
  blackListRoles: string[];
}) => {
  const path = usePathname();
  const [user, setUser] = useState<UseAuthUser | null>(null);
  const public_paths = [
    "/",
    "/login",
    "/signup",
    "/guest",
    "/preference",
    "/unauthorized",
    "/verify-email",
    "/_next",
    "/forgot-password",
    "/favicon.ico",
    "/api",
    "/tickets",
  ];

  useEffect(() => {
    if (!public_paths.includes(path)) {
      const fetchCurrUser = async () => {
        const response = (await authAPI.whoAmI()) as UseAuthUser;
        const hasBlacklistedRole = response.roles.some((role) =>
          blackListRoles.includes(role),
        );

        if (hasBlacklistedRole) {
          setUser(null);
          window.location.replace("/unauthorized"); // or /login
          return;
        }
        setUser(response);
      };
      fetchCurrUser();
    }
  }, [path, blackListRoles]);

  const login = async (
    identifier: string,
    password: string,
    remember: boolean,
  ) => {
    try {
      const response = await authAPI.login(identifier, password, remember);

      setUser(response.user_info);

      if (response.access_token.length > 0) {
        await setAuthCookies(response);
        const decoded = await decodeJWT(response.access_token);
        console.log(response.access_token);

        if (decoded.roles.includes("passenger")) {
          window.location.replace("/passenger");
        } else if (decoded.roles.includes("super_admin")) {
          window.location.replace("/superadmin");
        } else if (decoded.roles.includes("agent_admin")) {
          if (!response.user_info?.organization_id) {
            throw Error(
              "You are not assigned to an agent. Please Contact An Admin",
            );
          }
          if (response.user_info.agent_type == "operator-agent-admin") {
            window.location.replace("/operator-agent/ticket-booking");
          } else {
            window.location.replace("/agent/ticket-booking");
          }
        } else if (decoded.roles.includes("operator_admin")) {
          if (!response.user_info?.organization_id) {
            throw Error(
              "You are not assigned to an agent. Please Contact An Admin",
            );
          }
          window.location.replace("/operator");
        } else {
          console.log("No role matched");
        }
      }

      return response;
    } catch (error) {
      setUser(null);

      console.log(error);
      throw error;
    }
  };

  const value = useMemo(() => ({ user, setUser, login }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
