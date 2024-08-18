"use client";

import { UserData } from "@/@types";
import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { NextPage } from "next";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserTooltip from "./user-tooltip";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

export const UserLinkWithTooltip: NextPage<UserLinkWithTooltipProps> = ({
  username,
  children,
}) => {
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    staleTime: Infinity,
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
};
