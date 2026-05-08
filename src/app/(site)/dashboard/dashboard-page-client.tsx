'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  createCvAction,
  deleteCvAction,
  duplicateCvAction,
} from '@/modules/cv/data/actions';
import type { CvListItem, PaginatedCvList } from '@/modules/cv/data/mappers';
import { CvCard } from './components/cv-card';
import { CreateCvDialog } from './components/create-cv-dialog';
import { EmptyState } from './components/empty-state';

interface DashboardPageClientProps {
  initialData: PaginatedCvList;
}

export function DashboardPageClient({ initialData }: DashboardPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<CvListItem[]>(initialData.items);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cvPendingDelete, setCvPendingDelete] = useState<CvListItem | null>(
    null
  );

  function handleCreate(title: string) {
    startTransition(async () => {
      const result = await createCvAction({ title });
      if (result.ok) {
        toast.success('CV created');
        setDialogOpen(false);
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleEdit(id: string) {
    router.push(`/cv/${id}/edit`);
  }

  function handleDuplicate(id: string) {
    startTransition(async () => {
      const result = await duplicateCvAction(id);
      if (result.ok) {
        toast.success('CV duplicated');
        if (result.redirectTo) {
          router.push(result.redirectTo);
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleDeleteRequest(id: string) {
    const targetCv = items.find((item) => item.id === id);
    if (!targetCv) return;

    setCvPendingDelete(targetCv);
  }

  function handleDeleteConfirm() {
    if (!cvPendingDelete) return;
    const deletingId = cvPendingDelete.id;

    startTransition(async () => {
      const result = await deleteCvAction(deletingId);
      if (result.ok) {
        toast.success('CV deleted');
        setItems((prev) => prev.filter((cv) => cv.id !== deletingId));
        setCvPendingDelete(null);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-8'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-content-primary text-3xl font-bold'>My CVs</h1>
        <Button onClick={() => setDialogOpen(true)} disabled={isPending}>
          <Plus className='mr-2 h-4 w-4' />
          Create New CV
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState onCreate={() => setDialogOpen(true)} />
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((cv) => (
            <CvCard
              key={cv.id}
              cv={cv}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      <CreateCvDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
        isPending={isPending}
      />
      <Dialog
        open={cvPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isPending) {
            setCvPendingDelete(null);
          }
        }}
      >
        <DialogContent aria-describedby='delete-cv-dialog-description'>
          <DialogHeader>
            <DialogTitle>Delete this CV?</DialogTitle>
            <DialogDescription id='delete-cv-dialog-description'>
              {cvPendingDelete
                ? `This will permanently remove "${cvPendingDelete.title}" and all of its sections.`
                : 'This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setCvPendingDelete(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteConfirm}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete CV'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
