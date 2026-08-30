"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      if (json.success && json.data) {
        setUser(json.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signin = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchUser();
        router.push("/chat");
        return true;
      } else {
        setError(json.message || "Invalid email or password.");
        return false;
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        await fetchUser();
        router.push("/chat");
        return true;
      } else {
        setError(json.message || "Sign up failed.");
        return false;
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signout = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/sign-out", { method: "POST" });
      setUser(null);
      router.push("/sign-in");
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signin,
    signup,
    signout,
    refreshUser: fetchUser,
  };
}
