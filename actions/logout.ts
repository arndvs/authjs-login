"use server";

import { signOut } from "@/src/lib/auth/auth";

export const logout = async () => {
  await signOut();
};
