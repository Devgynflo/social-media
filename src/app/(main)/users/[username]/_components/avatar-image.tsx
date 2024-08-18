import { CropImageDialog } from "@/components/crop-image-dialog";
import { CameraIcon } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import resizer from "react-image-file-resizer";

interface AvatarImageProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

export function AvatarImage({ src, onImageCropped }: AvatarImageProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEPB",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  }

  return (
    <>
      <input
        type="file"
        className="sr-only hidden"
        ref={fileInputRef}
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        accept="image/*"
      />
      <button
        onClick={() => {
          fileInputRef.current?.click();
        }}
        type="button"
        className="group relative block"
      >
        <Image
          src={src}
          alt="Avatar preview"
          height={150}
          width={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <CameraIcon size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          cropAspectRatio={1}
          onCropped={onImageCropped}
        />
      )}
    </>
  );
}
