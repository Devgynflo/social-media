import { ForYouFeed } from "@/components/for-you-feed";
import { PostEditor } from "@/components/posts/editor/post-editor";
import { TrendsSidebar } from "@/components/trends-sidebar";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor immediatelyRender={false} /> {/* Corrige l'erreur SSR */}
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
