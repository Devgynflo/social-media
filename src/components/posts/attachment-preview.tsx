import { NextPage } from "next";
import { Attachment } from "./editor/hooks/useMediaUploads";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { X } from "lucide-react";

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

const AttachmentPreview: NextPage<AttachmentPreviewProps> = ({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}) => {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}

      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="p-1-5 absolute right-3 top-3 rounded-full bg-foreground text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20}></X>
        </button>
      )}
    </div>
  );
};

interface AttachmentPreviewsProps {
  attachements: Attachment[];
  onRemoveClick: (fileName: string) => void;
}

export function AttachmentPreviews({
  attachements,
  onRemoveClick,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachements.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachements.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => onRemoveClick(attachment.file.name)}
        />
      ))}
    </div>
  );
}
