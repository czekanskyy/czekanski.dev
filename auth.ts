import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { ADMIN_CREDENTIALS } from './credentials.local';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Get admin credentials from local config file
        const adminEmail = ADMIN_CREDENTIALS.email;
        const adminPasswordHash = ADMIN_CREDENTIALS.passwordHash;
        const adminName = ADMIN_CREDENTIALS.name;

        if (!adminEmail || !adminPasswordHash) {
          console.error('CRITICAL: Admin credentials not found in credentials.local.ts');
          return null;
        }

        // Check if email matches
        if (credentials.email !== adminEmail) {
          return null;
        }

        // Verify password
        try {
          const isValid = await bcrypt.compare(credentials.password as string, adminPasswordHash);

          if (!isValid) {
            return null;
          }

          // Return user object (will be stored in session)
          return {
            id: '1',
            email: adminEmail,
            name: adminName,
          };
        } catch (error) {
          console.error('Password verification error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async authorized({ request, auth }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPage = request.nextUrl.pathname.startsWith('/admin');
      const isOnLoginPage = request.nextUrl.pathname === '/admin/login';

      if (isOnAdminPage && !isOnLoginPage) {
        return isLoggedIn; // Return true if logged in, false triggers redirect to signIn page
      }

      return true; // Allow all other pages
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
