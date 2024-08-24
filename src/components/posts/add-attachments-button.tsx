import { NextPage } from "next";
import { useRef } from "react";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

export const AddAttachmentsButton: NextPage<AddAttachmentsButtonProps> = ({
  onFilesSelected,
  disabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="text-primary hover:text-primary"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        className="sr-only hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
};
