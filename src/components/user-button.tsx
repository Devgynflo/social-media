"use client";

import { useSession } from "@/hooks";
import { NextPage } from "next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";

import Link from "next/link";
import { Dot, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UserButtonProps {
  className?: string;
}

export const UserButton: NextPage<UserButtonProps> = ({ className }) => {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
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
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Mon profil
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 size-4" />
                Thème du systeme
                {theme === "system" && <Dot className="ms-2 size-5" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 size-4" />
                Thème clair
                {theme === "light" && <Dot className="ms-2 size-5" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 size-4" />
                Thème sombre
                {theme === "dark" && <Dot className="ms-2 size-5" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
            queryClient.clear();
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
