import { Metadata, NextPage } from "next";
import { BookmarkFeed } from "./bookmark-feed";
import { TrendsSidebar } from "@/components/trends-sidebar";

interface Props {}

export const metadata: Metadata = {
  title: "Bookmarks",
};

const Page: NextPage<Props> = ({}) => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Favoris</h1>
        </div>
        <BookmarkFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Page;
