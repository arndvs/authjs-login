"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
    // get the current user role
  const role = await currentRole();

  // if the user is an admin, return a success message
  if (role === UserRole.ADMIN) {
    return { success: "Allowed Server Action!" };
  }

  // if the user is not an admin, return an error message
  return { error: "Forbidden Server Action!" }
};
