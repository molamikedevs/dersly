'use client';

import { Loader2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/toast';
import AddMaterialForm from '@/features/materials/components/add-material-form';
import { MaterialRecord } from '@/types/materials';
import { deleteMaterialAction } from '../actions';

export default function MaterialMenu({ data }: { data: MaterialRecord }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const result = await deleteMaterialAction(data.id);
    setPending(false);

    if (!result.success) {
      toast.add({
        title: 'Could not delete material',
        description: result.error?.message,
      });
      return;
    }

    toast.add({ title: 'Material deleted' });
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
              aria-label={`Options for ${data.title}`}
            >
              <MoreVertical className="size-4" aria-hidden />
            </Button>
          }
        />

        <DropdownMenuContent align="end">
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
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit material</DialogTitle>
          </DialogHeader>

          <AddMaterialForm
            material={data}
            onSuccess={() => setEditing(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this material?</AlertDialogTitle>
            <AlertDialogDescription>
              {data.title} will be removed for every student. This cannot be
              undone.
            </AlertDialogDescription>
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
              {pending ? 'Deleting' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
