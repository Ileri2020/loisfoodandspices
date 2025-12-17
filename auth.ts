// @ts-nocheck
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from '@auth/prisma-adapter';

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) throw new Error("Please provide both email & password");

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) throw new Error("Invalid email or password");

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) throw new Error("Invalid email or password");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          contact: user.contact,
          role: user.role,
          image: user.image,
          providerid: user.providerid,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    // Persist all user info in the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? null;
        token.email = user.email ?? null;
        token.contact = user.contact ?? null;
        token.role = user.role ?? null;
        token.image = user.image ?? null;
        token.providerid = user.providerid ?? null;
      }
      return token;
    },

    // Make the token info available in the session object
    async session({ session, token }) {
      session.user.id = token.id!;
      session.user.name = token.name ?? null;
      session.user.email = token.email ?? null;
      session.user.contact = token.contact ?? null;
      session.user.role = token.role ?? null;
      session.user.image = token.image ?? null;
      session.user.providerid = token.providerid ?? null;
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 60 * 60, // 10 hours
  },

  jwt: {
    maxAge: 10 * 60 * 60, // 10 hours
  },

  debug: false,
});

export const runtime = "nodejs";
