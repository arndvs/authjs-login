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

  // Auth.js Pages: https://next-auth.js.org/configuration/pages
  // NextAuth.js automatically creates simple, unbranded authentication pages for handling Sign in, Sign out, Email Verification and displaying error messages. The options displayed on the sign-up page are automatically generated based on the providers specified in the options passed to NextAuth.js.
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  // Auth.js Events: https://next-auth.js.org/configuration/events
  // Events are asynchronous functions that do not return a response, they are useful for audit logs / reporting
  // or handling any other side-effects. You can specify a handler for any of these events below, for debugging
  // or for an audit log.
  events: {
    // user used OAuth provider to create account and sign in
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },

  // Auth.js Callbacks: https://next-auth.js.org/configuration/callbacks
  // Callbacks are asynchronous functions that return a response, they are useful for customising logic,
  //  implement access controls without a database and to integrate with external databases or APIs.
  callbacks: {

    async signIn({user, account}) {

        // Allow Oauth without email verification // NOTE: can vary based on providers allowed
        if (account?.provider !== 'credentials') return true;

        const existingUser = await getUserById(user.id);

        // Prevent sign in if email is not verified
        if (!existingUser?.emailVerified)  return false;

        //TODO: Add 2FA Check

        return true;
    },

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
