'use server';

import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';
import { z } from 'zod';

import { signIn } from '@/auth';
import { db } from '@/src/prisma/db';

// Work factor 12: ~250ms per hash on commodity hardware. High enough that a
// leaked table is expensive to crack, low enough that sign-up stays snappy.
const BCRYPT_ROUNDS = 12;

export type SignUpState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

const SignUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Please enter your name.' })
    .max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Passwords must be at least 8 characters.' })
    .max(200),
});

/**
 * Creates a credentials-backed account, then signs the new user straight in.
 *
 * Email is stored lower-cased because the unique index is case-sensitive —
 * without normalising, Alice@ and alice@ would be two separate accounts.
 */
export async function signUp(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const parsed = SignUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Check the fields above and try again.',
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.orm.public.User.where({ email })
    .select('id')
    .first();

  if (existing) {
    return {
      errors: { email: ['That email is already registered.'] },
      message: null,
    };
  }

  try {
    await db.orm.public.User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
    });
  } catch (error) {
    // Backstop for the race between the check above and this insert: two
    // simultaneous sign-ups with the same address both pass the read, and the
    // unique index rejects the loser.
    console.error('Sign-up failed:', error);
    return { message: 'Could not create the account. Please try again.' };
  }

  // signIn throws a redirect on success, so it must sit outside the try above
  // — catching NEXT_REDIRECT would swallow the navigation.
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: 'Account created, but sign-in failed. Try logging in.',
      };
    }
    throw error;
  }

  return { message: null };
}
