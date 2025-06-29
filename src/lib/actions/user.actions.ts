'use server';

import { createClient } from '@/db/supabase';
import { signUpSchema } from '../validations/auth';
import { z } from 'zod';

export async function signUpNewUser(values: z.infer<typeof signUpSchema>) {
  const supabase = await createClient();
  const user = signUpSchema.parse(values);

  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
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

export async function signOutUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out user:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
