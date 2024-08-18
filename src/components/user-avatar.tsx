import { NextPage } from "next";
import Image from "next/image";

import avatarPlaceholderImg from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

export const UserAvatar: NextPage<UserAvatarProps> = ({
  avatarUrl,
  size,
  className,
}) => {
  return (
    <Image
      src={avatarUrl || avatarPlaceholderImg}
      alt="avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full object-cover",
        className,
      )}
    />
  );
};
