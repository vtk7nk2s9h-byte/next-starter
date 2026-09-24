import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { db } from '@/src/prisma/db';

// Reads through Prisma against the contract database — the same store
// sign-up writes to. Only the columns the credentials check needs.
async function getUser(email: string) {
  try {
    return await db.orm.public.User.where({ email })
      .select('id', 'name', 'email', 'passwordHash', 'status')
      .first();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email.trim().toLowerCase());
          // No passwordHash means the account exists but authenticates through
          // a provider instead, so there is nothing to compare against here.
          if (!user || !user.passwordHash) return null;
          if (user.status === 'DISABLED') return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.passwordHash,
          );
          if (passwordsMatch) {
            return { id: user.id, name: user.name, email: user.email };
          }
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
