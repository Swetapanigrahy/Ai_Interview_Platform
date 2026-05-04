// Real authentication powered by Lovable Cloud (Supabase).
import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type { User } from "@supabase/supabase-js";

/** Get the friendly display name for a user (from metadata, falls back to email). */
export function displayName(user: User | null | undefined): string {
  if (!user) return "";
  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const name = (meta.display_name as string) || (meta.name as string) || "";
  if (name) return name;
  return user.email?.split("@")[0] ?? "there";
}

export async function signUp(name: string, email: string, password: string): Promise<User> {
  const redirectTo = `${window.location.origin}/`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: { display_name: name },
    },
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Could not create account.");
  return data.user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Invalid email or password.");
  return data.user;
}

export async function signOutUser(): Promise<void> {
  await supabase.auth.signOut();
  try { sessionStorage.clear(); } catch { /* ignore */ }
}

/**
 * React hook that tracks the current Supabase session.
 * IMPORTANT: subscribes to auth changes BEFORE fetching the initial session
 * to avoid missing the first event.
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, session, loading, signOut: signOutUser };
}
