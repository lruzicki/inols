import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"

// Rozszerz typy NextAuth
declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      roles?: string[]
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    roles?: string[]
  }
}

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid profile email api://4849c28c-cdde-4f8c-9200-265bbbac0e2c/user_impersonation"
        }
      }
    }),
  ],
  pages: {
    signIn: "/login", // Własna strona logowania
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Przekierowanie po zalogowaniu
      if (url.startsWith(baseUrl)) return `${baseUrl}/dashboard`
      else if (url.startsWith("http")) return url
      return baseUrl
    },
    async jwt({ token, account, profile }) {
      // Dodaj dodatkowe informacje do tokena
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        // Sprawdź role z Azure AD
        token.roles = (profile as any).roles || ["user"]
      }
      return token
    },
    async session({ session, token }) {
      // Dodaj dodatkowe informacje do sesji
      if (token) {
        session.accessToken = token.accessToken
        session.user.roles = token.roles
      }
      return session
    },
  },
})

export { handler as GET, handler as POST } 