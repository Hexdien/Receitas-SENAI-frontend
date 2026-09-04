import type { GuideFilter, Recipe } from "@/types/recipe";
import type { AuthUser } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

function getApiUrl(path: string) {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL não foi configurada. Crie um arquivo .env.local."
    );
  }

  return `${API_URL}${path}`;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("auth_user");

  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem("auth_user");
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(getApiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = "Não foi possível concluir a solicitação.";

    try {
      const error = await response.json();
      message = error.message || error.error || message;
    } catch {
      // Mantém mensagem padrão caso a API não retorne JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function getRecipes(filter: GuideFilter = "all") {
  const query = filter === "all" ? "" : `?filter=${filter}`;
  return request<Recipe[]>(`/recipes${query}`);
}

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token?: string;
  accessToken?: string;
  user?: AuthUser;
};

export async function login(payload: LoginPayload) {
  const data = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const token = data.token || data.accessToken;

  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("auth_token", token);
    }

    if (data.user) {
      localStorage.setItem("auth_user", JSON.stringify(data.user));
    }
  }

  return data;
}

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function register(payload: RegisterPayload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
}
