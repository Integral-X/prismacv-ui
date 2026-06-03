'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import type { NavbarUser } from '@/components/common/navbar-client';
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
import type { CvListItem } from '@/modules/cv/data/mappers';

import { CreateCvDialog } from '../components/create-cv-dialog';
import { CvCard } from '../components/cv-card';
import { DashboardHeader } from '../components/dashboard-header';
import { DashboardPageContent } from '../components/dashboard-page-content';
import { EmptyState } from '../components/empty-state';

interface DocumentsPageClientProps {
  initialCvs: CvListItem[];
  user: NavbarUser | null;
}

export function DocumentsPageClient({
  initialCvs,
  user,
}: DocumentsPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cvs, setCvs] = useState(initialCvs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cvPendingDelete, setCvPendingDelete] = useState<CvListItem | null>(
    null
  );

  const navbarUser: NavbarUser = user ?? {
    email: 'guest@prismacv.app',
    name: 'Guest',
  };

  function handleCreate(title: string) {
    startTransition(async () => {
      const result = await createCvAction({ title });

      if (result.ok) {
        toast.success('CV created');
        setDialogOpen(false);
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

  function handleEdit(id: string) {
    router.push(`/cv/${id}/edit`);
  }

  function handleDuplicate(id: string) {
    startTransition(async () => {
      const result = await duplicateCvAction(id);
      if (result.ok) {
        toast.success('CV duplicated');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleDeleteConfirm() {
    if (!cvPendingDelete) return;
    const deletingId = cvPendingDelete.id;

    startTransition(async () => {
      const result = await deleteCvAction(deletingId);
      if (result.ok) {
        toast.success('CV deleted');
        setCvs((prev) => prev.filter((cv) => cv.id !== deletingId));
        setCvPendingDelete(null);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <DashboardHeader user={navbarUser} title='My Document' />

      <DashboardPageContent cardClassName='flex flex-col gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-lg font-semibold text-content-primary'>
              Your resumes
            </h2>
            <p className='mt-1 text-sm text-content-secondary'>
              Create, edit, and manage all of your CV versions in one place.
            </p>
          </div>
          {cvs.length > 0 ? (
            <Button
              type='button'
              onClick={() => setDialogOpen(true)}
              disabled={isPending}
            >
              <Plus className='size-4' />
              Create CV
            </Button>
          ) : null}
        </div>

        {cvs.length === 0 ? (
          <EmptyState onCreate={() => setDialogOpen(true)} />
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {cvs.map((cv) => (
              <CvCard
                key={cv.id}
                cv={cv}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={(id) => {
                  const target = cvs.find((item) => item.id === id);
                  if (target) setCvPendingDelete(target);
                }}
              />
            ))}
          </div>
        )}
      </DashboardPageContent>

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
                ? `This will permanently remove "${cvPendingDelete.title}".`
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
    </>
  );
}
