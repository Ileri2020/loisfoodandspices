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

        if (!email || !password) {
          throw new Error("Please provide both email & password");
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
          throw new Error("Invalid email or password");
        }

        // Map all existing user fields
        // return {
        //   id: user.id,
        //   name: user.name,
        //   email: user.email,
        //   contact: user.contact,
        //   role: user.role,
        //   image: user.image,
        //   providerid: user.providerid,
        // };
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };

      },
    }),

    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  // callbacks: {
  //   async signIn({ user, account }) {
  //     if (account?.provider === "google") {
  //       try {
  //         const email = user.email!;
  //         const name = user.name!;
  //         const googleId = user.id!;
  //         const image = user.image?.replace(/=s\d+(-c)?$/, "=s500-c") ?? null;

  //         let existingUser = await prisma.user.findUnique({ where: { email } });

  //         if (!existingUser) {
  //           existingUser = await prisma.user.create({
  //             data: {
  //               email,
  //               name,
  //               image,
  //               role: "customer",
  //               providerid: await bcrypt.hash(googleId, parseInt(process.env.SALT_ROUNDS!)),
  //             },
  //           });
  //         }

  //         // Map DB user data back to session
  //         user.id = existingUser.id;
  //         user.name = existingUser.name;
  //         user.role = existingUser.role;
  //         user.contact = existingUser.contact;
  //         user.image = existingUser.image;
  //         user.providerid = existingUser.providerid;

  //         return true;
  //       } catch (err) {
  //         console.error("Google signIn error:", err);
  //         return false;
  //       }
  //     }

  //     // Credentials login always returns true if authorize succeeded
  //     return true;
  //   },

  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.name = user.name ?? null;
  //       token.email = user.email ?? null;
  //       token.contact = user.contact ?? null;
  //       token.role = user.role ?? null;
  //       token.image = user.image ?? null;
  //       token.providerid = user.providerid ?? null;
  //     }
  //     return token;
  //   },

  //   async session({ session, token }) {
  //     session.user.id = token.id!;
  //     session.user.name = token.name ?? null;
  //     session.user.email = token.email ?? null;
  //     session.user.contact = token.contact ?? null;
  //     session.user.role = token.role ?? null;
  //     session.user.image = token.image ?? null;
  //     session.user.providerid = token.providerid ?? null;
  //     return session;
  //   },
  // },

  session: {
    strategy: "database",
    maxAge: 10 * 60 * 60, // 10 hours in seconds
  },
  jwt: {
    maxAge: 10 * 60 * 60, // 10 hours
  },


  events: {
    async error(error) {
      console.error("AUTH_ERROR:", {
        name: error.name,
        message: error.message,
        cause: error.cause,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    },
  },

  



  // debug: false,
  debug: true,
});


export const runtime = "nodejs";