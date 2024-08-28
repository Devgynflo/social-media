"use client";

import useInitializeChatClient from "@/hooks/useInitializeChatClient";
import { Loader2Icon } from "lucide-react";
import { NextPage } from "next";
import { Chat as StreamChat } from "stream-chat-react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatChannel } from "./chat-channel";
import { useTheme } from "next-themes";
import { useState } from "react";

interface ChatProps {}

export const Chat: NextPage<ChatProps> = ({}) => {
  const chatClient = useInitializeChatClient();
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();

  if (!chatClient) return <Loader2Icon className="mx-auto my-3 animate-spin" />;

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute left-0 top-0 flex size-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSidebar
            onClose={() => setOpenSidebar(false)}
            open={openSidebar}
          />
          <ChatChannel
            open={!openSidebar}
            opensidebar={() => setOpenSidebar(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
};
