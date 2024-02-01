"use server";

import { signOut } from '@/lib/auth/next-auth-config';

export const logout = async () => {
  await signOut();
};
