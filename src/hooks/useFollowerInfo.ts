import { FollowerInfo } from "@/@types";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      ky.get(`/api/posts/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
