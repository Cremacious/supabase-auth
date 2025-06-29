'use server';

import { createClient } from '@/db/supabase';

export async function signUpNewUser({ email, password }: { email: string; password: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // options: {
    //   emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    // },
  });

  if (error) {
    console.error('Error signing up user:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
