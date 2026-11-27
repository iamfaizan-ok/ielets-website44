export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

const ACCESS_KEY = "bandora_access_token";
const REFRESH_KEY = "bandora_refresh_token";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function setTokens(access: string, refresh?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem("bandora_user");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

async function silentRefresh(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = (await res.json()) as { access?: string; refresh?: string };
  if (!data.access) {
    clearTokens();
    return null;
  }
  setTokens(data.access, data.refresh);
  return data.access;
}

function formatErrorMessage(status: number, rawDetail?: string): string {
  if (status === 402) {
    return rawDetail || "You are out of AI credits. Upgrade to Pro to continue.";
  }
  if (status === 429) {
    return "Too many requests. Please wait a minute and try again.";
  }
  return rawDetail || `Request failed (${status}).`;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const reqHeaders = new Headers(headers);
  if (!reqHeaders.has("Content-Type") && rest.body && typeof rest.body === "string") {
    reqHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAccessToken();
    if (token) reqHeaders.set("Authorization", `Bearer ${token}`);
  }

  let res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: reqHeaders,
  });

  if (res.status === 401 && auth) {
    const newAccess = await silentRefresh();
    if (newAccess) {
      reqHeaders.set("Authorization", `Bearer ${newAccess}`);
      res = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: reqHeaders });
    } else {
      clearTokens();
      throw new ApiError(401, "Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    let detail: string | undefined;
    try {
      const errData = (await res.json()) as { detail?: string; [k: string]: unknown };
      detail =
        errData.detail ||
        Object.values(errData)
          .flat()
          .find((v) => typeof v === "string");
    } catch {
      // Non-JSON error body
    }
    throw new ApiError(res.status, formatErrorMessage(res.status, detail));
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
