import { NextPage } from "next";
import { SearchResults } from "./search-result";

interface SearchPageProps {
  searchParams: {
    q: string;
  };
}

export function generateMetadata({ searchParams: { q } }: SearchPageProps) {
  return {
    title: `Recherche pour : ${q}`,
  };
}

const SearchPage: NextPage<SearchPageProps> = ({ searchParams: { q } }) => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow">
          <h1 className="line-clamp-2 text-center text-2xl font-bold">
            Résultats de recherche pour : &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
    </main>
  );
};

export default SearchPage;
