"use client";

import { useSession } from "@/hooks";
import { NextPage } from "next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { LogOutIcon, UserIcon } from "lucide-react";
import { logout } from "@/app/(auth)/action";
import { cn } from "@/lib/utils";

interface UserButtonProps {
  className?: string;
}

export const UserButton: NextPage<UserButtonProps> = ({ className }) => {
  const { user } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user?.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>
          Connecté en tant que @{user.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/user/profile/${user.username}`}>
          <DropdownMenuItem className="flex items-center gap-2 p-2">
            <UserIcon className="mr-2 size-4" />
            Mon profil
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center gap-2 p-2"
        >
          <LogOutIcon className="mr-2 size-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
