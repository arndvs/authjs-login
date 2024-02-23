"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  // TODO: server stuff deleting cookies or tokens etc.
  await signOut();
};
