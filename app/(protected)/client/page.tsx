"use client";

import { UserInfo } from "@/src/components/user-info";
import { useCurrentUser } from "@/src/hooks/use-current-user";

const ClientPage = () => {
  const user = useCurrentUser();

  return (
    <UserInfo
      label="📱 Client component"
      user={user}
    />
   );
}

export default ClientPage;
