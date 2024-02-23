"use client";

import { logout } from "@/actions/logout";
import { DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";

interface LogoutButtonProps {
  children?: React.ReactNode;
};

export const LogoutButton = ({
  children
}: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return (<>


          <DropdownMenuItem onClick={onClick} className="">
            <span className="flex items-center cursor-pointer hover:bg-gray-100">
                <ExitIcon className="h-4 w-4 mr-2 text-gray-300 " />
                Logout
            </span>
          </DropdownMenuItem>



  </>

  );
};
