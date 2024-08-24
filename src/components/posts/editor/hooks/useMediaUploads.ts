import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: Boolean;
}

export default function useMediaUploads() {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamesFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment-${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamesFiles.map((file) => ({
          file,
          isUploading: true,
        })),
      ]);

      return renamesFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((attachment) => {
          const uploadResult = res.find((r) => r.name === attachment.file.name);

          if (!uploadResult) {
            return attachment;
          }

          return {
            ...attachment,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(err) {
      setAttachments((prev) =>
        prev.filter((attachment) => !attachment.isUploading),
      );
      toast({
        variant: "destructive",
        description: err.message,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Veuillez patienter, l'envoi est en cours",
      });

      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "Vous pouvez ajouter 5 médias maximum",
      });
    }
    startUpload(files);
  }

  function removeAttachments(fileName: string) {
    setAttachments((prev) =>
      prev.filter((attachment) => attachment.file.name !== fileName),
    );
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    removeAttachments,
    reset,
    isUploading,
    uploadProgress,
  };
}
