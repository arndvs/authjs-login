"use server";

import { signOut } from "@/authjs/auth";

export const logout = async () => {
  await signOut();
};
