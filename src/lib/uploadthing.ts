import { FileRoute } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<FileRoute>();
