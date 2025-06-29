'use server';

import { createClient } from '@/components/db/supabase';
import { signUpSchema } from '../validations/auth';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function signUpNewUser(values: z.infer<typeof signUpSchema>) {
  const supabase = await createClient();
  const user = signUpSchema.parse(values);

  try {
    // First, create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      // options: {
      //   emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      // },
    });

    if (error) {
      console.error('Error signing up user in Supabase:', error);
      return { success: false, error: error.message };
    }

    // If Supabase signup was successful, create user in Prisma database
    if (data.user) {
      const prismaUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name || null,
        },
      });

      return { success: true, data: { supabaseUser: data, prismaUser } };
    }

    return { success: true, data };
  } catch (prismaError) {
    console.error('Error creating user in database:', prismaError);
    // If Prisma fails, we might want to clean up the Supabase user
    // but for now, we'll just return the error
    return { success: false, error: 'Failed to create user profile in database' };
  }
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

// Get user by email from Prisma database
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        posts: true, // Include user's posts
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

// Get user by ID from Prisma database
export async function getUserById(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true, // Include user's posts
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

// Update user profile
export async function updateUserProfile(id: number, data: { name?: string; email?: string }) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Failed to update user profile' };
  }
}

// Get current authenticated user from Supabase and match with Prisma user
export async function getCurrentUser() {
  const supabase = await createClient();
  
  try {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
    
    if (error || !supabaseUser) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get the corresponding user from Prisma database
    const prismaUser = await prisma.user.findUnique({
      where: { email: supabaseUser.email! },
      include: {
        posts: true,
      },
    });

    return { 
      success: true, 
      user: {
        supabase: supabaseUser,
        profile: prismaUser
      }
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { success: false, error: 'Failed to get current user' };
  }
}

// Delete user (both from Supabase and Prisma)
export async function deleteUser(email: string) {
  try {
    // First delete from Prisma (this will cascade delete posts)
    await prisma.user.delete({
      where: { email },
    });

    // Note: Deleting from Supabase requires admin privileges
    // This is typically done through Supabase admin API or dashboard
    // For now, we'll just delete from our database

    return { success: true, message: 'User profile deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}
