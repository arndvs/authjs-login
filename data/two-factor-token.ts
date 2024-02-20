import { db } from "@/lib/db";

 //get the 2fA token from the database by token
export const getTwoFactorTokenByToken = async (token: string) => {
  try {

    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token }
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

 //get the 2fA token from the database by email
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {

    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email }
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};
