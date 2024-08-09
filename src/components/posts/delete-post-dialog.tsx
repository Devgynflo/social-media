import { PostData } from "@/@types";
import { NextPage } from "next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeletePostMutation } from "./mutation";
import { LoadingButton } from "../loading-button";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
  data: PostData;
  open: boolean;
  onClose: () => void;
}

export const DeletePostDialog: NextPage<DeletePostDialogProps> = ({
  data,
  open,
  onClose,
}) => {
  const mutation = useDeletePostMutation();
  function handleOpenChange() {
    if (!open && !mutation.isPending) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suppression du message</DialogTitle>
          <DialogDescription>
            Etes-vous certain de vouloir supprimer ce message ?
            <br />
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            loading={mutation.isPending}
            variant={"destructive"}
            onClick={() =>
              mutation.mutate(data.id, { onSuccess: () => onClose() })
            }
          >
            Supprimer
          </LoadingButton>
          <Button
            onClick={onClose}
            disabled={mutation.isPending}
            variant={"outline"}
          >
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
