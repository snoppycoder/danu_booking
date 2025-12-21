"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { decodeJWT, getAccessToken } from "./auth";
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
    remember: boolean
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
        setUser(response);
      };
      fetchCurrUser();
    }
  }, []);

  const login = async (
    identifier: string,
    password: string,
    remember: boolean
  ) => {
    try {
      const response = await authAPI.login(identifier, password, remember);

      setUser(response.user_info);

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
