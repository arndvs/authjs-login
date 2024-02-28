import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    // get the user from the database
    const user = await db.user.findUnique({
        // find the user by the email
        where: { email }
    });
    // return the user
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    // get the user from the database
    const user = await db.user.findUnique({
        // find the user by the ID
         where: { id }
        });
    // return the user
    return user;
  } catch {
    return null;
  }
};
