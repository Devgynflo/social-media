import { getPostDataIncludeUser } from "@/@types";
import { UserInfoSidebar } from "@/components/post/user-info-sidebar";
import { PostItem } from "@/components/posts/list";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Loader2Icon } from "lucide-react";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface PageProps {
  params: {
    postId: string;
  };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataIncludeUser(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({ params: { postId } }: PageProps) {
  const { user } = await validateRequest();

  if (!user) return { title: "Post not found" };
  const post = await getPost(postId, user.id);

  return {
    title: `${post.author.displayName} : ${post.content.slice(0, 50)}...`,
  };
}

const Page: NextPage<PageProps> = async ({ params: { postId } }) => {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        Vous devez être connecté pour voir ce post
      </p>
    );
  }
  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostItem post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2Icon className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.author} />
        </Suspense>
      </div>
    </main>
  );
};

export default Page;
