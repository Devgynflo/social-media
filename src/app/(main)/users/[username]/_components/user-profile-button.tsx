"use client";

import { UserData } from "@/@types";
import { Button } from "@/components/ui/button";
import { NextPage } from "next";
import { useState } from "react";
import { EditProfileDialog } from "./edit-profile-dialog";

interface UserProfileButtonProps {
  user: UserData;
}

export const UserProfileButton: NextPage<UserProfileButtonProps> = ({
  user,
}) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  return (
    <>
      <Button variant={"outline"} onClick={() => setShowDialog(true)}>
        Editez votre profil
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};
