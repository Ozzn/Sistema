import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos")
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
        })

        if (!user) throw new Error("Usuario no encontrado")

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordMatch) throw new Error("Contraseña incorrecta")

        const menus = user.role?.menus?.map((menu) => ({
          id: menu.id,
          name: menu.name,
          path: menu.path,
          category: menu.category,
        })) || []

        return {
          id: user.id,
          email: user.email,
          name: user.nick, // or user.nombres, depending on your requirement
          role: user.role?.name,
          menus,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.menus = user.menus
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        ...session.user,
        id: token.id as number,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
        menus: token.menus as { id: number; name: string; path: string; category: string; }[],
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
