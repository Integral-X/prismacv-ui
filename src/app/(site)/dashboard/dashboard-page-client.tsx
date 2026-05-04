'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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

  function handleDelete(id: string) {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this CV?')) return;

    startTransition(async () => {
      const result = await deleteCvAction(id);
      if (result.ok) {
        toast.success('CV deleted');
        setItems((prev) => prev.filter((cv) => cv.id !== id));
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
              onDelete={handleDelete}
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
    </div>
  );
}
