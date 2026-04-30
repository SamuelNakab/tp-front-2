import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  getSession,
  getUserFromSession,
  loginWithEmail,
  logout,
  onAuthStateChange,
  registerWithEmail,
} from "../services/authService";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const session = await getSession();
        if (mounted) {
          setState({
            user: getUserFromSession(session),
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (mounted) {
          setState({
            user: null,
            loading: false,
            error: error instanceof Error ? error.message : "Unable to load session.",
          });
        }
      }
    }

    loadSession();

    const subscription = onAuthStateChange((_event, session) => {
      if (mounted) {
        setState((prev) => ({
          ...prev,
          user: getUserFromSession(session),
          loading: false,
          error: null,
        }));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const actions = useMemo(
    () => ({
      async login(email: string, password: string) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
          await loginWithEmail(email, password);
          setState((prev) => ({ ...prev, loading: false, error: null }));
        } catch (error) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Login failed.",
          }));
          throw error;
        }
      },

      async register(email: string, password: string) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
          await registerWithEmail(email, password);
          setState((prev) => ({ ...prev, loading: false, error: null }));
        } catch (error) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Registration failed.",
          }));
          throw error;
        }
      },

      async signOut() {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
          await logout();
          setState((prev) => ({ ...prev, loading: false, error: null }));
        } catch (error) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Logout failed.",
          }));
          throw error;
        }
      },
    }),
    []
  );

  return { ...state, ...actions };
}
