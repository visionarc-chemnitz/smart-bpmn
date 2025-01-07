
import NextAuth from "next-auth"
import prisma from "./lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Provider } from "next-auth/providers"

// auth providers
import Google from "next-auth/providers/google"
import GitHub from "@auth/core/providers/github"
// mail providers
import Resend from "next-auth/providers/resend"
import SendGrid from "next-auth/providers/sendgrid"


import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { sendMagicSignInLink } from "./emails/magicLink"
 


// config providers
const providers: Provider[] = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  }), 
  GitHub({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!
  }),
  SendGrid({
    apiKey: process.env.SENDGRID_API_KEY,
    from: process.env.RESEND_FROM,
    sendVerificationRequest: sendMagicSignInLink
  })
]

const getProviderIcon = (providerId: string) => {
  switch (providerId) {
    case "google":
      return FcGoogle;
    case "github":
      return FaGithub;
    default:
      return null;
  }
};

// provider map with icons
export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name, icon: null };
    } else {
      return { id: provider.id, name: provider.name, icon: getProviderIcon(provider.id) };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/signin",
  },
  // session strategy refer to https://authjs.dev/concepts/session-strategies#database
  session: {
    strategy: "database",
  },
})

