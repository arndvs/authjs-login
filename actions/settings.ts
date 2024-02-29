"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { update } from "@/auth";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (
    // get the values from the form
  values: z.infer<typeof SettingsSchema>
) => {

    // get the current user
  const user = await currentUser();

  // if no user return error
  if (!user) {
    return { error: "Unauthorized" }
  }

  // check if the user exists in the database
  const dbUser = await getUserById(user.id);

  // if no database user return error
  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  // if the user is an OAuth user, remove the email, password, and new password fields
  // OAuth users can't modify these fields
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // if the user is not an OAuth user and the email is provided and the email is different from the current email
  if (values.email && values.email !== user.email) {
    // get existing user by email
    const existingUser = await getUserByEmail(values.email);

    // if the user exists and the user id is different from the current user id
    if (existingUser && existingUser.id !== user.id) {
        // return error
      return { error: "Email already in use!" }
    }

    // generate a verification token
    const verificationToken = await generateVerificationToken(
        // use the new email
      values.email
    );
    // send the verification email
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  // if the user is not an OAuth user and the password and new password are provided
  if (values.password && values.newPassword && dbUser.password) {
    // compare the password with the hashed password from the database
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    // if the passwords don't match return error
    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(
      values.newPassword,
      10,
    );
    // update the values with the hashed password
    values.password = hashedPassword;
    // remove the new password from the values
    values.newPassword = undefined;
  }

  // get the user from the database and update the values
  const updatedUser =
  await db.user.update({
    // find the user by id
    where: { id: dbUser.id },
    // spread all the user values and update the ones that are different
    data: {
      ...values,
    }
  });

  update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    }
  });

  return { success: "Settings Updated!" }
}
