'use client';

import { Loader2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import type { ActionResponse } from '@/types/global';

type Props = {
  label: string;
  editTitle: string;
  editForm: (close: () => void) => ReactNode;
  editClassName?: string;
  onDelete: () => Promise<ActionResponse<unknown>>;
  deleteTitle: string;
  deleteDescription: string;
  deletedToast: string;
  deleteErrorToast: string;
  deleteLabel?: string;
  deletePendingLabel?: string;
  extraItems?: ReactNode;
};

export default function RowMenu({
  label,
  editTitle,
  editForm,
  editClassName = 'sm:max-w-lg',
  onDelete,
  deleteTitle,
  deleteDescription,
  deletedToast,
  deleteErrorToast,
  deleteLabel = 'Delete',
  deletePendingLabel = 'Deleting',
  extraItems,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const result = await onDelete();
    setPending(false);

    if (!result.success) {
      toast.add({
        title: deleteErrorToast,
        description: result.error?.message,
      });
      return;
    }

    toast.add({ title: deletedToast });
    setConfirming(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label={`Options for ${label}`}
            >
              <MoreVertical className="size-4" aria-hidden />
            </Button>
          }
        />

        <DropdownMenuContent
          align="end"
          className="w-auto min-w-52 whitespace-nowrap"
        >
          {extraItems && (
            <>
              {extraItems}
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            onClick={() => setTimeout(() => setEditing(true), 0)}
          >
            <Pencil className="size-4" aria-hidden />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setTimeout(() => setConfirming(true), 0)}
          >
            <Trash2 className="size-4" aria-hidden />
            {deleteLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent
          className={cn('max-h-[85svh] overflow-y-auto', editClassName)}
        >
          <DialogHeader>
            <DialogTitle>{editTitle}</DialogTitle>
          </DialogHeader>

          {editing && editForm(() => setEditing(false))}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
            >
              {pending && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {pending ? deletePendingLabel : deleteLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
