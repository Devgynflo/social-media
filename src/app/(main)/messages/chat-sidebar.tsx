"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks";
import { cn } from "@/lib/utils";
import { MailPlusIcon, XIcon } from "lucide-react";
import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import {
  ChannelList,
  ChannelPreview,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { NewChatDialog } from "./new-chat-dialog";
import { se } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";

interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
}

export const ChatSidebar: NextPage<ChatSidebarProps> = ({ onClose, open }) => {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const { channel } = useChatContext();

  useEffect(() => {
    if (channel?.id)
      queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
  }, [channel?.id, queryClient]);
  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );
  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{ type: "messaging", members: { $in: [user.id] } }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: { $in: [user.id] },
              },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
};

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState<boolean>(false);

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size={"icon"} variant={"ghost"} onClick={onClose}>
            <XIcon className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button size={"icon"} variant={"ghost"} title="Nouvelle conversation">
          <MailPlusIcon
            className="size-5"
            onClick={() => setShowNewChatDialog(true)}
          />
        </Button>
      </div>
      {showNewChatDialog && (
        <NewChatDialog
          onChatCreated={() => {
            onClose();
            setShowNewChatDialog(false);
          }}
          onOpenChange={setShowNewChatDialog}
        />
      )}
    </>
  );
}
