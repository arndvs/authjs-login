import { auth } from "@/auth";

// used in sever components, server actions, and api routes - everything server side

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
    const session = await auth();

    return session?.user?.role;
  };
