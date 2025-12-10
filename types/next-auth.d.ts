// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      contact?: string | null;
      avatarUrl?: string | null;
      providerid?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email: string;
    role: string;
    contact?: string | null;
    avatarUrl?: string | null;
    providerid?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    contact?: string | null;
    avatarUrl?: string | null;
    providerid?: string | null;
  }
}
