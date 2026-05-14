import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

import { findUserByEmail } from '@/lib/airtable/users';
import { verifyPassword } from './password';

if (!process.env.NEXTAUTH_URL && process.env.APP_URL) {
  process.env.NEXTAUTH_URL = process.env.APP_URL;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) return null;

        const user = await findUserByEmail(email);
        if (!user || user.status === 'DISABLED' || !user.passwordHash) return null;
        if (user.role === 'CLIENT' && !user.clientRecordId) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          clientRecordId: user.clientRecordId,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.clientRecordId = user.clientRecordId;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.clientRecordId = token.clientRecordId;
      session.user.status = token.status;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};
