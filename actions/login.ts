"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import {
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
} from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  generateVerificationToken,
  generateTwoFactorToken
} from "@/lib/tokens";
import {
  getTwoFactorConfirmationByUserId
} from "@/data/two-factor-confirmation";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  // fetch existing user by email
  const existingUser = await getUserByEmail(email);

  // if no user, or no email, or no password (i.e. can only login with OAuth providers)
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" }
  }

  // User email exists but the email is not verified
  if (!existingUser.emailVerified) {
    // generate a new verification token
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    // send the verification email to the user's email
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Confirmation email sent!" };
  }

  // User email is verified and 2FA is enabled
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    // if 2FA code already exists
    if (code) {
      // get the two factor token from the existing user's email
      const twoFactorToken = await getTwoFactorTokenByEmail(
        existingUser.email
      );

      // if no two factor token, or the token does not match the code, return invalid code error
      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      // Check if the token has expired and return an error if it has
      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      //TODO: setup resend code logic if the code is expired

      // delete the two factor token from the database
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      });

      // check for existing 2FA confirmation on the user
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      // if there is an existing confirmation, delete it from the database
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        });
      }

      // create a new 2FA confirmation for the user
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        }
      });
    } else {

      // generate a new 2FA token
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)

      // send the 2FA token to the user's email
      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token,
      );

      // return a two factor boolean true to update the UI
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error;
  }
};
