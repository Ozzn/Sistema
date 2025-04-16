
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Mueve la instancia de Prisma fuera del handler para reutilización
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email y contraseña son requeridos");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              role: {
                include: {
                  menus: true,
                },
              },
            },
          });

          if (!user || !user.password) {
            throw new Error("Usuario no encontrado o contraseña no configurada");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            throw new Error("Contraseña incorrecta");
          }

          const menus = user.role?.menus?.map((menu) => ({
            id: menu.id,
            name: menu.name,
            path: menu.path,
            category: menu.category,
          })) || [];

          return {
            id: user.id, // Ensure the id remains a number
            email: user.email,
            name: `${user.nombres} ${user.apellidos}`,
            role: user.role?.name,
            menus,
          };
        } catch (error) {
          console.error("Error en autorización:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.menus = user.menus;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = Number(token.id);
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.menus = token.menus as any[];
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Página para mostrar errores
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };