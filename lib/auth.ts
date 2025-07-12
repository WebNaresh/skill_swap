
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
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
                profileImage: (profile as any).picture || "",
                isSetupCompleted: false,
                isVerified: true,
                isActive: true,
              },
            });
          } else {
            // Update existing user with latest Google data if needed
            const profilePicture = (profile as any).picture || "";
            if (
              existingUser.name !== profile.name ||
              existingUser.profileImage !== profilePicture
            ) {
              await prisma.user.update({
                where: { email: profile.email },
                data: {
                  name: profile.name || existingUser.name,
                  profileImage: profilePicture || existingUser.profileImage,
                },
              });
            }
          }
        }
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      // Initial sign in - store user data in token
      if (account && profile) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: profile.email! },
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
            token.id = dbUser.id;
            token.isSetupCompleted = dbUser.isSetupCompleted;
            token.isActive = dbUser.isActive;
          }
        } catch (error) {
          console.error("Error fetching user data in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (token?.email) {
          // Fetch fresh user data from database for each session
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
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
            // Populate session with complete database user data
            session.user = {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name || "",
              image: dbUser.profileImage,
              isSetupCompleted: dbUser.isSetupCompleted,
              isActive: dbUser.isActive,
            };
          } else {
            // Fallback: user not found in database
            session.user = {
              id: token.id as string || "",
              email: token.email || "",
              name: token.name || "",
              image: token.picture || undefined,
              isSetupCompleted: false,
              isActive: false,
            };
          }
        }
      } catch (error) {
        console.error("Error fetching user data in session callback:", error);
        // Fallback to token data if database query fails
        session.user = {
          id: token.id as string || "",
          email: token.email || "",
          name: token.name || "",
          image: token.picture || undefined,
          isSetupCompleted: token.isSetupCompleted as boolean || false,
          isActive: token.isActive as boolean || true,
        };
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
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
