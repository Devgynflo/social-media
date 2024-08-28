"use client";

import { LoadingButton } from "@/components/loading-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { UserAvatar } from "@/components/user-avatar";
import { useSession } from "@/hooks";
import useDebounce from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { set } from "date-fns";
import { se } from "date-fns/locale";
import { CheckIcon, Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import { NextPage } from "next";
import { useState } from "react";
import { UserResponse } from "stream-chat";
import {
  DefaultStreamChatGenerics,
  divMod,
  useChatContext,
} from "stream-chat-react";

interface NewChatDialogProps {
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
}

export const NewChatDialog: NextPage<NewChatDialogProps> = ({
  onChatCreated,
  onOpenChange,
}) => {
  const { client, setActiveChannel } = useChatContext();
  const { toast } = useToast();
  const { user: loggedInUser } = useSession();

  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);

  const searchInputDebounced = useDebounce(searchInput);

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["users", searchInputDebounced],
    queryFn: async () => {
      return client.queryUsers(
        {
          id: { $ne: loggedInUser?.id },
          role: { $ne: "admin" },
          ...(searchInputDebounced
            ? {
                $or: [
                  { name: { $autocomplete: searchInputDebounced } },
                  { username: { $autocomplete: searchInputDebounced } },
                ],
              }
            : {}),
        },
        { name: 1, username: 1 },
        { limit: 10 },
      );
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", {
        members: [loggedInUser?.id, ...selectedUsers.map((u) => u.id)],
        name:
          selectedUsers.length > 1
            ? `${loggedInUser.displayName}, ${selectedUsers.map((u) => u.name).join(", ")}`
            : undefined,
      });
      await channel.create();
      return channel;
    },
    onSuccess: (channel) => {
      setActiveChannel(channel);
      onChatCreated();
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Erreur lors de la création de la conversation",
        description: error.message,
      });
    },
  });

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="bg-card p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogHeader>Nouvelle conversation</DialogHeader>
        </DialogHeader>
        <div>
          <div className="group relative">
            <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary-foreground" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur"
              className="h-12 w-full pe-4 ps-14 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {!!selectedUsers.length && (
            <div className="mt-4 flex flex-wrap gap-2 p-2">
              {selectedUsers.map((user) => (
                <SelectedUserTag
                  key={user.id}
                  user={user}
                  onRemove={() => {
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u.id !== user.id),
                    );
                  }}
                />
              ))}
            </div>
          )}
          <hr />
          <div className="h-96 overflow-y-auto">
            {isSuccess &&
              data?.users.length > 0 &&
              data.users.map((user) => (
                <UserResult
                  key={user.id}
                  user={user}
                  selected={selectedUsers.some((u) => u.id === user.id)}
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.some((u) => u.id === user.id)
                        ? prev.filter((u) => u.id !== user.id)
                        : [...prev, user],
                    );
                  }}
                />
              ))}

            {isSuccess && !data.users.length && (
              <p className="my-3 text-center text-muted-foreground">
                Aucun utilisateur trouvé. Veuillez modifier votre recherche.
              </p>
            )}

            {isFetching && (
              <Loader2Icon className="mx-auto my-3 animate-spin" />
            )}

            {isError && (
              <p className="my-3 text-center text-destructive">
                Une erreur est survenue lors de la recherche des utilisateurs.
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="px-6 pb-6">
          <LoadingButton
            loading={mutation.isPending}
            disabled={!selectedUsers.length}
            onClick={() => {
              mutation.mutate();
            }}
          >
            Commencer une conversation
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface UserResultProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  selected: boolean;
  onClick: () => void;
}

function UserResult({ onClick, user, selected }: UserResultProps) {
  return (
    <button
      className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <UserAvatar avatarUrl={user.image} />
        <div className="flex flex-col text-start">
          <p className="font-bold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.username}</p>
        </div>
      </div>
      {selected && <CheckIcon className="size-5 text-green-500" />}
    </button>
  );
}

interface SelectedUserTagProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  onRemove: () => void;
}

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50"
    >
      <UserAvatar avatarUrl={user.image} size={24} />
      <p className="font-bold"> {user.name}</p>
      <XIcon className="mx-2 size-5 text-muted-foreground" />
    </button>
  );
}
