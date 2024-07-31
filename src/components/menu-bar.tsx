import { NextPage } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BellIcon, BookmarkIcon, HomeIcon, MailIcon } from "lucide-react";

interface MenuBarProps {
  className?: string;
}

export const MenuBar: NextPage<MenuBarProps> = ({ className }) => {
  return (
    <div className={className}>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3"
        title="Accueil"
        asChild
      >
        <Link href={"/"}>
          <HomeIcon />
          <span className="hidden lg:inline">Accueil</span>
        </Link>
      </Button>

      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3"
        title="Notifications"
        asChild
      >
        <Link href={"/notifications"}>
          <BellIcon />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>

      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3"
        title="Messages"
        asChild
      >
        <Link href={"/messages"}>
          <MailIcon />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>

      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3"
        title="Marque page"
        asChild
      >
        <Link href={"/bookmarks"}>
          <BookmarkIcon />
          <span className="hidden lg:inline">Marque-Page</span>
        </Link>
      </Button>
    </div>
  );
};
