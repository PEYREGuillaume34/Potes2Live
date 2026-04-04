
// better-auth.d.ts
import "better-auth";
import "better-auth/react";

declare module "better-auth" {
  interface User {
    bio?: string | null;
    avatar_url?: string | null;
  }
}

declare module "better-auth/react" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
      bio?: string | null;
      avatar_url?: string | null;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}