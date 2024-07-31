"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchFieldProps {}

export const SearchField: NextPage<SearchFieldProps> = ({}) => {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const q = form.q.value.trim();
    if (!q) return;

    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    /* Amélioration progressive grâce à l'utilisation des attributs method et action qui permet une redirection saine et sans js */
    <form onSubmit={handleSubmit} method="GET" action={`/search`}>
      <div className="relative">
        <Input name="q" placeholder="Recherche..." className="px-5" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
};
