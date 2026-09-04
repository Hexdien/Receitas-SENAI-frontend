"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  getStoredUser,
  getToken,
  login as loginRequest,
  logout as logoutRequest,
} from "@/lib/api";
import type { AuthUser } from "@/types/auth";

type LoginPayload = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!getToken()) {
        if (active) setLoading(false);
        return;
      }

      // Mostra logo o usuário salvo para a tela não piscar...
      if (active) setUser(getStoredUser());

      // ...e confirma com a API, que é quem sabe se o token ainda vale
      // e qual o papel atual da conta.
      try {
        const atual = await getCurrentUser();

        if (active) {
          setUser(atual);
          localStorage.setItem("auth_user", JSON.stringify(atual));
        }
      } catch {
        // Token inválido/expirado: o request já limpou o localStorage.
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await loginRequest(payload);
    setUser(data.user ?? null);
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin: user?.role === "ADMIN", loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
  }

  return context;
}
