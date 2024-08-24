import { cn } from "@/lib/utils";
import { Media } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";

interface MediaPreviewsProps {
  attachements: Media[];
}

export const MediaPreviews: NextPage<MediaPreviewsProps> = ({
  attachements,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachements.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachements.map((attachment) => (
        <MediaPreview attachement={attachment} key={attachment.id} />
      ))}
    </div>
  );
};

interface MediaPreviewProps {
  attachement: Media;
}

const MediaPreview: NextPage<MediaPreviewProps> = ({ attachement }) => {
  if (attachement.type === "IMAGE") {
    return (
      <Image
        src={attachement.url}
        alt="Media preview"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (attachement.type === "VIDEO") {
    return (
      <div>
        <video
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
          src={attachement.url}
        />
      </div>
    );
  }

  return <p className="text-destructive">Média non supportée</p>;
};
