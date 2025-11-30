"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { decodeJWT, getAccessToken } from "./auth";

interface User {
  sub: string;
  roles: string[];
  portal: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetch = async () => {
      const token = (await getAccessToken()) || "";
      const usr = await decodeJWT(token);
      if (token) {
        try {
          //   const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
          setUser(usr);
        } catch (err) {
          console.error("Invalid token");
          setUser(null);
        }
      }
    };
    fetch();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
