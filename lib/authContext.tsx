"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { getAccessToken, setAuthCookies } from "./auth";

import { LoginResponse, UseAuthUser, User } from "./model";
import { authAPI } from "@/app/api/api";
import { usePathname } from "next/navigation";
import { decodeJWT } from "./jwt";
import { toast } from "sonner";
import { useRef } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UseAuthUser | null;
  access_token: string;
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
  const router = useRouter();
  const [user, setUser] = useState<UseAuthUser | null>(null);
  const [access_token, setAccessToken] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);
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
  function handleSocketConnections(access_token: string) {
    if (socketRef.current) {
      socketRef.current.close(); // prevent duplicates
    }
    console.log(access_token);
    const ws = new WebSocket(
      `wss://danu.biisho.et/api/v1/ws/notifications/?token=${access_token}`,
    );

    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      console.log("RAW MESSAGE:", event.data);

      try {
        const data = JSON.parse(event.data);

        console.log("📩 Parsed Message:", data);

        toast.success(data.title || "Notification", {
          description: data.message,
        });
      } catch (error) {
        console.error("❌ JSON parse error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("🔌 WebSocket closed:", event.reason);
    };
  }
  useEffect(() => {
    const initSocket = async () => {
      const token = await getAccessToken();

      if (token) {
        setAccessToken(token);
        handleSocketConnections(token);
      }
    };

    initSocket();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!public_paths.includes(path)) {
      const fetchCurrUser = async () => {
        try {
          const response = (await authAPI.whoAmI()) as UseAuthUser;

          const hasBlacklistedRole = response.roles.some((role) =>
            blackListRoles.includes(role),
          );

          if (hasBlacklistedRole) {
            setUser(null);
            router.push("/unauthorized");
            return;
          }

          setUser(response);
        } catch (error) {
          console.error("Failed to fetch user on load", error);
        }
      };
      fetchCurrUser();
    }
  }, [path, blackListRoles]);
  // ⚠️ Note: Be careful not to add 'handleSocketConnections' to the dependency array unless it's wrapped in a useCallback

  const login = async (
    identifier: string,
    password: string,
    remember: boolean,
  ) => {
    try {
      const response = await authAPI.login(identifier, password, remember);

      if (response && response.user_info.roles.length == 0) {
        toast.error("No roles assigned. Please contact support.");
        return;
      }

      if (response.access_token.length > 0) {
        setAccessToken(response.access_token);
        handleSocketConnections(response.access_token);

        setUser(response.user_info);
        await setAuthCookies(response);
        const decoded = await decodeJWT(response.access_token);

        if (decoded.roles.includes("passenger")) {
          router.push("/passenger");
        } else if (decoded.roles.includes("super_admin")) {
          router.push("/superadmin");
        } else if (decoded.roles.includes("agent_admin")) {
          if (!response.user_info?.organization_id) {
            throw Error(
              "You are not assigned to an agent. Please Contact An Admin",
            );
          }
          if (response.user_info.agent_type == "operator-agent-admin") {
            router.replace("/operator-agent/ticket-booking");
          } else {
            router.replace("/agent/ticket-booking");
          }
        } else if (decoded.roles.includes("operator_admin")) {
          if (!response.user_info?.organization_id) {
            throw Error(
              "You are not assigned to an agent. Please Contact An Admin",
            );
          }
          router.replace("/operator");
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

  const value = useMemo(() => ({ user, setUser, login, access_token }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
