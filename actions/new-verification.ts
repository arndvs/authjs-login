"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  // get the token from the database
  const existingToken = await getVerificationTokenByToken(token);

  // if no token exists, return an error
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  // check if the token has expired - if new Date(existingToken.expires) is less than new Date(), the token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();

  // if the token has expired, return an error
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

 // get the user by the email in the token
  const existingUser = await getUserByEmail(existingToken.email);

  // if the user does not exist, return an error
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  // update the user's emailVerified field and email field
  await db.user.update({
    // update the user where the id is the id of the existing user
    where: { id: existingUser.id },
    // set the emailVerified field to the current date and time and the email field to the email in the token
    data: {
      emailVerified: new Date(),
      // verify email when user updates email
      email: existingToken.email,
    }
  });

  // delete the token from the database
  await db.verificationToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Email verified!" };
};
