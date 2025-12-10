import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username?: string | null;
    role?: string | null;
    department?: string | null;
    contact?: string | null;
    avatarUrl?: string | null;
    sex?: string | null;
  }

  interface Session {
    user: {
      id: string;
      username?: string | null;
      role?: string | null;
      department?: string | null;
      contact?: string | null;
      avatarUrl?: string | null;
      sex?: string | null;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    role?: string;
    department?: string;
    contact?: string;
    avatarUrl?: string;
    sex?: string;
  }
}
