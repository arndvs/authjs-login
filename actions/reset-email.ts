"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const resetEmail = async (values: z.infer<typeof ResetSchema>) => {

    // Validate the input fields using the ResetSchema
  const validatedFields = ResetSchema.safeParse(values);

    // If the input fields are invalid, return an error
  if (!validatedFields.success) {
    return { error: "Invalid emaiL!" };
  }

  // extract the email from the validated fields
  const { email } = validatedFields.data;

  // find the existing user by email
  const existingUser = await getUserByEmail(email);

  // if the user does not exist, return an error
  if (!existingUser) {
    return { error: "Email not found!" };
  }

  // generate a password reset token
  const passwordResetToken = await generatePasswordResetToken(email);
  // send the token to the user's email
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: "Reset email sent!" };
}
