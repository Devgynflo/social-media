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
import useMediaUploads from "./hooks/useMediaUploads";
import { AddAttachmentsButton } from "../add-attachments-button";
import { AttachmentPreviews } from "../attachment-preview";
import { Loader2Icon } from "lucide-react";
import { useDropzone } from "@uploadthing/react";
import { cn } from "@/lib/utils";
import { ClipboardEvent } from "react";

interface PostEditorProps {
  immediatelyRender: boolean;
}

export const PostEditor: NextPage<PostEditorProps> = ({
  immediatelyRender,
}) => {
  const { user } = useSession();
  const mutation = useSubmitPostMutation();
  const {
    attachments,
    removeAttachments,
    startUpload,
    isUploading,
    uploadProgress,
    reset: resetMediaUpload,
  } = useMediaUploads();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();

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
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments
          .map((attachment) => attachment.mediaId)
          .filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUpload();
        },
      },
    );
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData?.items)
      .filter((item) => item.kind === "file")
      .map((i) => i.getAsFile()) as File[];

    startUpload(files);
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-xl">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <div className="w-full" {...rootProps}>
          <EditorContent
            onPaste={handlePaste}
            editor={editor}
            className={cn(
              "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3",
              isDragActive && "outline-dashed",
            )}
          />
          {/* Drag and drop zone */}
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments && (
        <AttachmentPreviews
          attachements={attachments}
          onRemoveClick={removeAttachments}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2Icon className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentsButton
          disabled={isUploading || attachments.length >= 5}
          onFilesSelected={startUpload}
        />
        <LoadingButton
          loading={mutation.isPending}
          onClick={onSubmit}
          disabled={!input.trim() || isUploading}
          className="min-w-20"
        >
          Envoyer
        </LoadingButton>
      </div>
    </div>
  );
};
