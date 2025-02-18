
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

const customPrismaAdapter = {
  ...PrismaAdapter(prisma),
  async deleteSession(sessionId: string) {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken: sessionId },
      });

      if (session) {
        await prisma.session.delete({
          where: { sessionToken: sessionId },
        });
        console.log('Session deleted:', sessionId);
      } else {
        console.log('No session found to delete:', sessionId);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  },
};

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
  adapter: customPrismaAdapter,
  providers,
  pages: {
    signIn: "/signin",
  },
  // session strategy refer to https://authjs.dev/concepts/session-strategies#database
  session: {
    strategy: "database",
  },
  trustHost: true,  
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      // Before creating the session, check if there is an existing session
      const existingSession = await prisma.session.findFirst({
        where: { userId: user.id },
      });
  
      if (!existingSession) {
        console.log("No existing session found for user, proceeding with sign-in");
      }
  
      return true; // Continue with sign-in
    },
  },
})

