"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  apiFetch,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/apiClient";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  plan_tier: "FREE" | "PRO";
  ai_credits: number;
  target_band: string;
  is_verified: boolean;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await apiFetch<UserProfile>("/accounts/me/");
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const token = getAccessToken();
    if (!token) {
      Promise.resolve().then(() => {
        if (active) setLoading(false);
      });
      return () => {
        active = false;
      };
    }
    apiFetch<UserProfile>("/accounts/me/")
      .then((profile) => {
        if (active) setUser(profile);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    async (usernameOrEmail: string, password: string) => {
      const username = usernameOrEmail.includes("@")
        ? usernameOrEmail.split("@")[0]
        : usernameOrEmail;
      const tokens = await apiFetch<{ access: string; refresh: string }>(
        "/accounts/login/",
        {
          method: "POST",
          auth: false,
          body: JSON.stringify({ username, password }),
        }
      );
      setTokens(tokens.access, tokens.refresh);
      await refreshUser();
    },
    [refreshUser]
  );

  const register = useCallback(
    async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const parts = name.trim().split(/\s+/);
      const first_name = parts[0] || "";
      const last_name = parts.slice(1).join(" ");
      const username = email.split("@")[0].replace(/[^a-zA-Z0-9_.-]/g, "_");

      await apiFetch("/accounts/register/", {
        method: "POST",
        auth: false,
        body: JSON.stringify({
          username,
          email,
          first_name,
          last_name,
          password,
        }),
      });
      await login(username, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    try {
      if (getAccessToken()) {
        await apiFetch("/accounts/logout/", {
          method: "POST",
          body: JSON.stringify({ refresh }),
        });
      }
    } catch {
      // Ignore network errors during logout
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, refreshUser, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider.");
  return ctx;
}

const RETURN_URL_KEY = "bandora_return_url";

export function isSafeInternalPath(path: string | null): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

export function saveReturnUrl(url: string) {
  if (typeof window === "undefined" || !isSafeInternalPath(url)) return;
  sessionStorage.setItem(RETURN_URL_KEY, url);
}

export function peekReturnUrl(): string | null {
  if (typeof window === "undefined") return null;
  const param = new URLSearchParams(window.location.search).get("next");
  if (isSafeInternalPath(param)) return param;
  const stored = sessionStorage.getItem(RETURN_URL_KEY);
  return isSafeInternalPath(stored) ? stored : null;
}

export function consumeReturnUrl(): string | null {
  if (typeof window === "undefined") return null;
  const target = peekReturnUrl();
  sessionStorage.removeItem(RETURN_URL_KEY);
  return target;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      if (currentPath) saveReturnUrl(currentPath);
      const nextParam = currentPath
        ? `?next=${encodeURIComponent(currentPath)}`
        : "";
      router.replace(`/signup${nextParam}`);
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted">
        Loading your workspace...
      </div>
    );
  }

  return <>{children}</>;
}
