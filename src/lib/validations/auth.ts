import { z } from 'zod';

// Sign up validation schema
export const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Sign in validation schema
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Update password schema
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types for TypeScript inference
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
