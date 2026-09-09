'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddClassForm from './add-class-form';

export default function AddClass() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="h-11">
          <Plus className="size-4" aria-hidden />
          New class
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New class</DialogTitle>
          <DialogDescription>
            An invite code is generated automatically once the class is created.
          </DialogDescription>
        </DialogHeader>
        <AddClassForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
