import { NextPage } from "next";
import Link from "next/link";
import { UserButton } from "./user-button";
import { SearchField } from "./search-field";

interface NavbarProps {}

export const Navbar: NextPage<NavbarProps> = ({}) => {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href={"/"} className="text-2xl font-bold text-primary">
          Social Media
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
};
