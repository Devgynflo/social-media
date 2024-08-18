import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const FileRoute = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatar: f({ image: { maxFileSize: "512KB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { user } = await validateRequest();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { user: user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;
      // https://utfs.io/a/fi2x6hl2vx/3dab492c-1ca9-4c8b-b459-9ad2e8d82a4d-qyorgb.webp

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];
        // 3dab492c-1ca9-4c8b-b459-9ad2e8d82a4d-qyorgb.webp

        await new UTApi().deleteFiles(key);
      }

      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.user.id);

      //https://utfs.io/a/<APP_ID>/<FILE_KEY>
      const avatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: { avatarUrl },
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.user.id, avatarUrl };
    }),
} satisfies FileRouter;

export type FileRoute = typeof FileRoute;
