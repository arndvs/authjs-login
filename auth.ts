import NextAuth from "next-auth"
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {

    // returns the JWT that will be available to the client
    async jwt({ token }) {

        // token.sub is the authenticated user's ID. If it's not set, the user is not authenticated, return the token as is
        if (!token.sub) return token;

        // get the user from the database
        const existingUser = await getUserById(token.sub);

        // if the user doesn't exist, return the token as is
        if (!existingUser) return token;

        // assign the role to the token
        token.role = existingUser.role;

        return token;
      },

    // returns the session that will be available to the client
    async session({ token, session }) {
        // console.log('sessiontoken:', token, session);

        // if the user is authenticated, assign the user's ID to the session
      if (token.sub && session.user) {

        session.user.id = token.sub;
      }

      // if the user has a role, assign the role to the session
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },

  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
