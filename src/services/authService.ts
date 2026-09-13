import type { User as SupabaseUser } from "@supabase/supabase-js";

import { supabase } from "./supabase";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  phone?: string;
};

export function mapSupabaseUser(user: SupabaseUser): AuthUser {
  const fullName = String(user.user_metadata?.full_name ?? "").trim();
  const [firstName = "", ...lastNameParts] = fullName.split(/\s+/).filter(Boolean);

  return {
    id: user.id,
    username: fullName || user.email?.split("@")[0] || "ClothX user",
    email: user.email ?? "",
    firstName,
    lastName: lastNameParts.join(" "),
    image: String(user.user_metadata?.avatar_url ?? ""),
    phone: user.phone,
  };
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error("Unable to sign in");

  return mapSupabaseUser(data.user);
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        full_name: name.trim(),
      },
    },
  });

  if (error) throw error;

  return {
    user: data.user ? mapSupabaseUser(data.user) : null,
    hasSession: Boolean(data.session),
  };
}