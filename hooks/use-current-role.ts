import { useSession } from "next-auth/react";

// used in client components, client actions, and pages - everything client side

export const useCurrentRole = () => {
  const session = useSession();

  return session.data?.user?.role;
};
