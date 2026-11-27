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
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<{ email: string; message: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  startGoogleAuth: () => Promise<void>;
  completeGoogleAuth: (params: {
    code?: string;
    state?: string;
    error?: string;
  }) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string>;
  confirmPasswordReset: (payload: {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
  }) => Promise<string>;
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
    async (email: string, password: string) => {
      const tokens = await apiFetch<{ access: string; refresh: string }>(
        "/accounts/login/",
        {
          method: "POST",
          auth: false,
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        }
      );
      setTokens(tokens.access, tokens.refresh);
      await refreshUser();
    },
    [refreshUser]
  );

  const register = useCallback(
    async ({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      return apiFetch<{ email: string; message: string }>("/accounts/signup/", {
        method: "POST",
        auth: false,
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirm_password: confirmPassword,
        }),
      });
    },
    []
  );

  const startGoogleAuth = useCallback(async () => {
    const res = await apiFetch<{ auth_url: string }>("/accounts/google/url/", {
      auth: false,
    });
    window.location.assign(res.auth_url);
  }, []);

  const completeGoogleAuth = useCallback(
    async (params: { code?: string; state?: string; error?: string }) => {
      const res = await apiFetch<{
        access: string;
        refresh: string;
        user: UserProfile;
      }>("/accounts/google/callback/", {
        method: "POST",
        auth: false,
        body: JSON.stringify(params),
      });
      setTokens(res.access, res.refresh);
      setUser(res.user);
    },
    []
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    const res = await apiFetch<{ detail: string }>("/accounts/password-reset/", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    return res.detail;
  }, []);

  const confirmPasswordReset = useCallback(
    async (payload: {
      email: string;
      otp: string;
      password: string;
      confirmPassword: string;
    }) => {
      const res = await apiFetch<{ detail: string }>(
        "/accounts/password-reset/confirm/",
        {
          method: "POST",
          auth: false,
          body: JSON.stringify({
            email: payload.email.trim().toLowerCase(),
            otp: payload.otp,
            password: payload.password,
            confirm_password: payload.confirmPassword,
          }),
        }
      );
      return res.detail;
    },
    []
  );

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const res = await apiFetch<{
      valid: boolean;
      access: string;
      refresh: string;
      user: UserProfile;
    }>("/accounts/verify-otp/", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, otp }),
    });
    setTokens(res.access, res.refresh);
    setUser(res.user);
  }, []);

  const resendOtp = useCallback(async (email: string) => {
    await apiFetch("/accounts/resend-otp/", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email }),
    });
  }, []);

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
      value={{
        user,
        loading,
        refreshUser,
        login,
        register,
        verifyOtp,
        resendOtp,
        startGoogleAuth,
        completeGoogleAuth,
        requestPasswordReset,
        confirmPasswordReset,
        logout,
      }}
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
