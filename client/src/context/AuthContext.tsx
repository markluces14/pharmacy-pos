import { createContext, useState, useEffect, useMemo, useContext } from "react";
import type { ReactNode } from "react";
import { api } from "../api/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user
  async function fetchUser() {
    setLoading(true);
    try {
      await api.get("/sanctum/csrf-cookie"); // CSRF cookie for Laravel Sanctum
      const response = await api.get("/api/user");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await api.get("/sanctum/csrf-cookie"); // CSRF cookie for Sanctum
      const res = await api.post("/api/login", { email, password });
      setUser(res.data.user);
      // Set token for future requests:
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      return true;
    } catch (error) {
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/api/logout");
      setUser(null);
    } catch (error) {
      // handle error optionally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const trySessionRestore = async () => {
      try {
        await api.get("/sanctum/csrf-cookie");
        await fetchUser();
      } catch {
        setUser(null);
      }
    };
    trySessionRestore();
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
