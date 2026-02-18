import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async authorized({ auth }) {
      return !!auth;
    },
  },
  session: {
    strategy: 'jwt',
  },
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
