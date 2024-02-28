import { db } from "@/lib/db";

export const getAccountByUserId = async (userId: string) => {
  // get the account from the database
  try {
    // get the account from the database
    const account = await db.account.findFirst({
      // find the account by the user ID
      where: { userId }
    });

    // return the account
    return account;
  } catch {
    return null;
  }
};
