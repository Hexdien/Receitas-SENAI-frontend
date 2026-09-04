import type { GuideFilter, Recipe, RecipeInput } from "@/types/recipe";
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

/**
 * A API responde erro sempre no mesmo formato (standardError), então basta
 * ler "message" para mostrar algo útil na tela.
 */
async function handleError(response: Response): Promise<never> {
  let message = "Não foi possível concluir a solicitação.";

  try {
    const error = await response.json();
    message = error.message || error.error || message;
  } catch {
    // A API pode não devolver JSON (ex.: erro de proxy).
  }

  if (response.status === 401) {
    // Token expirado ou inválido: derruba a sessão local.
    logout();
  }

  throw new Error(message);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  let response: Response;

  try {
    response = await fetch(getApiUrl(path), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Não foi possível falar com o servidor. Verifique sua conexão."
    );
  }

  if (!response.ok) {
    return handleError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Envio de formulário com arquivo. O Content-Type NÃO é definido à mão:
 * o navegador precisa gerar o boundary do multipart sozinho.
 */
async function requestForm<T>(
  path: string,
  method: "POST" | "PUT",
  input: RecipeInput
): Promise<T> {
  const token = getToken();

  const body = new FormData();
  body.append("nome", input.nome);
  body.append("desc", input.desc);
  body.append("tempo", String(input.tempo));

  if (input.categoria) {
    body.append("categoria", input.categoria);
  }

  if (input.imagem) {
    body.append("imagem", input.imagem);
  }

  let response: Response;

  try {
    response = await fetch(getApiUrl(path), {
      method,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });
  } catch {
    throw new Error(
      "Não foi possível falar com o servidor. Verifique sua conexão."
    );
  }

  if (!response.ok) {
    return handleError(response);
  }

  return response.json();
}

// ------------------------------------------------------------------ receitas

export async function getRecipes(filter: GuideFilter = "all") {
  const query = filter === "all" ? "" : `?filter=${filter}`;
  return request<Recipe[]>(`/recipes${query}`);
}

export async function getRecipe(id: Recipe["id"]) {
  return request<Recipe>(`/recipes/${id}`);
}

export async function createRecipe(input: RecipeInput) {
  return requestForm<Recipe>("/recipes", "POST", input);
}

export async function updateRecipe(id: Recipe["id"], input: RecipeInput) {
  return requestForm<Recipe>(`/recipes/${id}`, "PUT", input);
}

export async function deleteRecipe(id: Recipe["id"]) {
  return request<void>(`/recipes/${id}`, { method: "DELETE" });
}

// ----------------------------------------------------------------- favoritos

export async function getFavorites() {
  return request<Recipe[]>("/favoritos");
}

export async function addFavorite(id: Recipe["id"]) {
  return request<Recipe>(`/favoritos/${id}`, { method: "POST" });
}

export async function removeFavorite(id: Recipe["id"]) {
  return request<void>(`/favoritos/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------- auth

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
  return request<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Revalida a sessão guardada no localStorage contra a API. */
export async function getCurrentUser() {
  return request<AuthUser>("/auth/me");
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
}
