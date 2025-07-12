/**
 * NextAuth.js Configuration for SkillCircle Platform
 * Handles Google OAuth authentication with database integration
 */

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" && profile?.email) {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!existingUser) {
            // Create new user with Google OAuth data
            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || "",
                profileImage: profile.picture || "",
                isSetupCompleted: false,
                isVerified: true, // Google OAuth users are considered verified
              },
            });
          } else {
            // Update existing user with latest Google data
            await prisma.user.update({
              where: { email: profile.email },
              data: {
                name: profile.name || existingUser.name,
                profileImage: profile.picture || existingUser.profileImage,
              },
            });
          }
        }
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
    async session({ session, user }) {
      if (session.user && user) {
        // Fetch user from database to get complete profile
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: {
            id: true,
            email: true,
            name: true,
            profileImage: true,
            isSetupCompleted: true,
            isActive: true,
          },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.isSetupCompleted = dbUser.isSetupCompleted;
          session.user.isActive = dbUser.isActive;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle post-authentication redirects
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
