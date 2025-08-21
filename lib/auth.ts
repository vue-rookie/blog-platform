import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getDatabase } from "./mongodb"
import type { User } from "./models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const db = await getDatabase()
          const usersCollection = db.collection<User>("users")

          const user = await usersCollection.findOne({
            email: credentials.email,
            isActive: true,
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            role: user.role,
            avatar: user.avatar,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.avatar = user.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // 允许所有认证成功的用户登录
      return true
    },
    async redirect({ url, baseUrl }) {
      // 如果是相对路径，则添加baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // 如果回调URL在同一域名下，则允许
      else if (new URL(url).origin === baseUrl) return url
      // 否则重定向到首页
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
}
