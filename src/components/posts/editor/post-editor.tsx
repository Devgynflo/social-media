"use client";

import { NextPage } from "next";
// Editor
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { UserAvatar } from "@/components/user-avatar";
import { useSession } from "@/hooks";
import "./styles.css";
import { useSubmitPostMutation } from "./mutation";
import { LoadingButton } from "@/components/loading-button";

interface PostEditorProps {
  immediatelyRender: boolean;
}

export const PostEditor: NextPage<PostEditorProps> = ({
  immediatelyRender,
}) => {
  const { user } = useSession();
  const mutation = useSubmitPostMutation();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Tapez ici votre message",
      }),
    ],
    immediatelyRender,
  });
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    mutation.mutate(input, {
      onSuccess: () => {
        editor?.commands.clearContent();
      },
    });
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-xl">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton
          loading={mutation.isPending}
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Envoyer
        </LoadingButton>
      </div>
    </div>
  );
};
