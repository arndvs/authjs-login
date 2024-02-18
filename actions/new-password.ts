"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema> ,
  token?: string | null,
) => {

   // If the token is missing, return an error
  if (!token) {
    return { error: "Missing token!" };
  }

  // Validate the fields using the NewPasswordSchema
  const validatedFields = NewPasswordSchema.safeParse(values);

  // If the fields are invalid, return an error
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  // Get the password from the validated fields data
  const { password } = validatedFields.data;

  // Get the password reset token by the token
  const existingToken = await getPasswordResetTokenByToken(token);

  // If the token does not exist, return an error
  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  // check if the token as expired
  const hasExpired = new Date(existingToken.expires) < new Date();

  // If the token has expired, return an error
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // Get the user by the email from the token
  const existingUser = await getUserByEmail(existingToken.email);

  // If the user does not exist, return an error
  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user with the new password
  await db.user.update({
    // Find the user by the id
    where: { id: existingUser.id },
    // Update the user password with the new hashed password
    data: { password: hashedPassword },
  });

  // Delete the password reset token
  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Password updated!" };
};
