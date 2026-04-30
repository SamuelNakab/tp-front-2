import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }

  return supabase;
}

function normalizeAuthError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  return message;
}

export async function registerWithEmail(email: string, password: string) {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(normalizeAuthError(error.message));
  }

  return data;
}

export async function loginWithEmail(email: string, password: string) {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(normalizeAuthError(error.message));
  }

  return data;
}

export async function logout() {
  const client = getSupabaseClient();
  const { error } = await client.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function getSession() {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const client = getSupabaseClient();
  const { data } = client.auth.onAuthStateChange(callback);
  return data.subscription;
}

export function getUserFromSession(session: Session | null): User | null {
  return session?.user ?? null;
}
