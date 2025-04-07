// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      role: string;
      menus: {
        id: number;
        name: string;
        path: string;
        category: string;
      }[];
    };
  }

  interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    menus: {
      id: number;
      name: string;
      path: string;
      category: string;
    }[];
  }
}
