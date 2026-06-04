'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import type { NavbarUser } from '@/components/common/navbar-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createCvAction, deleteCvAction } from '@/modules/cv/data/actions';
import type { CvListItem } from '@/modules/cv/data/mappers';
import type { Job, JobStats } from '@/modules/jobs/data/mappers';

import { CreateCvDialog } from './components/create-cv-dialog';
import { DashboardFeatureCards } from './components/dashboard-feature-cards';
import { DashboardHeader } from './components/dashboard-header';
import { DashboardHero } from './components/dashboard-hero';
import { DashboardStatCards } from './components/dashboard-stat-cards';
import { formatRelativeTime } from './lib/format-relative-time';

interface DashboardPageClientProps {
  initialCvs: CvListItem[];
  initialJobs: Job[];
  initialStats: JobStats;
  user: NavbarUser | null;
}

export function DashboardPageClient({
  initialCvs,
  initialJobs,
  initialStats,
  user,
}: DashboardPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cvs, setCvs] = useState(initialCvs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cvPendingDelete, setCvPendingDelete] = useState<CvListItem | null>(
    null
  );

  const displayName =
    user?.name?.trim() || user?.email.split('@')[0] || 'there';
  const navbarUser: NavbarUser = user ?? {
    email: 'guest@prismacv.app',
    name: 'Guest',
  };

  const latestCv = cvs[0];
  const cvUpdatedLabel = latestCv
    ? formatRelativeTime(latestCv.updatedAt)
    : 'No versions yet';

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
      <DashboardHeader user={navbarUser} />

      <div className='flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8'>
        <div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
          <DashboardHero
            userName={displayName}
            hasResumes={cvs.length > 0}
            onCreateResume={() => setDialogOpen(true)}
            isPending={isPending}
          />

          <DashboardStatCards
            stats={initialStats}
            cvCount={cvs.length}
            cvUpdatedLabel={cvUpdatedLabel}
          />

          <DashboardFeatureCards jobs={initialJobs} cvs={cvs} />
        </div>
      </div>

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
