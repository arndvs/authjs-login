"use client";

import { UserRole } from "@prisma/client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
};

export const RoleGate = ({
  children,
  allowedRole,
}: RoleGateProps) => {

    // get the current user tole
  const role = useCurrentRole();

  // if role is not allowed, show an error message
  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    )
  }

  // if role is allowed, show the content
  return (
    <>
      {children}
    </>
  );
};
