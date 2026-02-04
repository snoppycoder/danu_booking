"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { decodeJWT, getAccessToken, setAuthCookies } from "./auth";
import { useRouter } from "next/navigation";
import { LoginResponse, User } from "./model";
import { authAPI } from "@/app/api/api";
import { usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!(path == "/login")) {
      const fetchCurrUser = async () => {
        const response = (await authAPI.whoAmI()) as User;
        const hasBlacklistedRole = response.roles.some((role) =>
          blackListRoles.includes(role.slug),
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
  }, []);

  const login = async (
    identifier: string,
    password: string,
    remember: boolean,
  ) => {
    try {
      const response = await authAPI.login(identifier, password, remember);

      setUser(response.user_info);
      console.log(response);

      if (response) {
        await setAuthCookies(response);
        const decoded = await decodeJWT(response.access_token);
        // toast.success("You have successfully Logged In");
        // console.log(decoded);

        if (decoded.roles.includes("passenger")) {
          // route.replace("/passenger");
          window.location.replace("/passenger");
        } else if (decoded.roles.includes("super_admin")) {
          // route.replace("/superadmin");
          window.location.replace("/superadmin");
        } else if (decoded.roles.includes("agent_admin")) {
          // route.replace("/agent");
          window.location.replace("/agent");
        } else if (decoded.roles.includes("operator_admin")) {
          // route.replace("/operator");
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

  return (
    <AuthContext.Provider value={{ user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
