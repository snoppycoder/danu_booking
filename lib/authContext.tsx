"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  use,
} from "react";
import { getAccessToken, setAuthCookies } from "./auth";

import Dexie from "dexie";
import { Constants } from "@/lib/constant";
import { LoginResponse, UseAuthUser, User } from "./model";
import { authAPI } from "@/app/api/api";
import { usePathname } from "next/navigation";
import { decodeJWT } from "./jwt";
import { toast } from "sonner";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import db from "./dixiedb";

interface AuthContextType {
  user: UseAuthUser | null;
  access_token: string;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;

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
  // Add a ref to handle our reconnection timeouts safely
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [count, setCount] = useState(0);
  const public_paths = Constants.public_paths;

  useEffect(() => {
    const loadCount = async () => {
      const record = await db.settings.get("unreadCount");
      if (record) {
        setCount(Number(record.value));
      }
    };

    loadCount();
  }, []);
  useEffect(() => {
    if ((user?.id || "").length > 0) {
      localStorage.setItem("user_id", user?.id || "");
    }
  }, [user]);
  useEffect(() => {
    db.settings.put({ key: "unreadCount", value: count.toString() });
  }, [count]);
  function handleSocketConnections(token: string) {
    if (socketRef.current) {
      // Prevent duplicates by closing any existing connection
      socketRef.current.close();
    }

    const ws = new WebSocket(
      `wss://danu.biisho.et/api/v1/ws/notifications/?token=${token}`,
    );

    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      // If we connect successfully, clear any pending reconnection attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        const notification = {
          ...data,
          user_id: user?.id || "unknown", // associate with current user or mark as unknown
          id: crypto.randomUUID(), // generate a new UUID
          received_at: new Date().toISOString(),
        };
        await db.notifications.put({
          ...notification,
          received_at: new Date().toISOString(),
        });
        console.log(data, "Received WebSocket message");
        toast.success(data.title || "Notification", {
          description: data.message,
        });
        setCount((prev) => prev + 1);
      } catch (error) {
        console.error("❌ JSON parse error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      // Do not try to reconnect here; let onclose handle it to avoid duplicate triggers
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.reason);

      if (token) {
        console.log("🔄 Attempting to reconnect in 5 seconds... with", token);
        reconnectTimeoutRef.current = setTimeout(() => {
          handleSocketConnections(token);
        }, 3000);
      }
    };
  }

  useEffect(() => {
    let isMounted = true; // The crucial flag to prevent Ghost Connections

    const initSocket = async () => {
      const token = await getAccessToken();

      // ONLY connect if the component hasn't been unmounted during the async await
      if (token && isMounted) {
        setAccessToken(token);
        handleSocketConnections(token);
      }
    };

    initSocket();

    return () => {
      isMounted = false; // Mark component as unmounted

      // Cleanup the socket
      if (
        socketRef.current &&
        socketRef.current.readyState !== WebSocket.CLOSED
      ) {
        socketRef.current.close();
      }
      // Cleanup the timeout loop so it doesn't run in the background
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
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

  const value = useMemo(
    () => ({ user, setUser, login, access_token, count, setCount }),
    [user, access_token, count, setCount],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
