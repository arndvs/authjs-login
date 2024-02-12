"use server";

import { signOut } from "@/src/auth/auth";

export const logout = async () => {
  await signOut();
};
