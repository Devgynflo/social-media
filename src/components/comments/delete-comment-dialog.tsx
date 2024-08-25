import { CommentData } from "@/@types";
import { NextPage } from "next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeleteCommentMutation } from "./mutation";
import { LoadingButton } from "../loading-button";
import { Button } from "../ui/button";

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

export const DeleteCommentDialog: NextPage<DeleteCommentDialogProps> = ({
  comment,
  open,
  onClose,
}) => {
  const mutation = useDeleteCommentMutation(comment);
  function handleOpenChange() {
    if (!open && !mutation.isPending) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suppression du commentaire</DialogTitle>
          <DialogDescription>
            Etes-vous certain de vouloir supprimer ce commentaire ?
            <br />
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            loading={mutation.isPending}
            variant={"destructive"}
            onClick={() =>
              mutation.mutate(
                { id: comment.id },
                { onSuccess: () => onClose() },
              )
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
