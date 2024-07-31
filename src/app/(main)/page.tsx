import { postDataIncludeUser } from "@/@types";
import { PostEditor } from "@/components/posts/editor/post-editor";
import { PostItem } from "@/components/posts/list";
import { TrendsSidebar } from "@/components/trends-sidebar";
import prisma from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: postDataIncludeUser,
  });

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
      <TrendsSidebar />
    </main>
  );
}
