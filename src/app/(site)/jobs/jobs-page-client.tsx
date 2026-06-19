"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import type { NavbarUser } from "@/components/common/navbar-client";
import { DashboardHeader } from "@/app/(site)/dashboard/components/dashboard-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ManualCreateJobFormData } from "@/lib/validations/jobs";
import {
  createJobAction,
  deleteJobAction,
  updateJobStatusAction,
} from "@/modules/jobs/data/actions";
import type { CvListItem } from "@/modules/cv/data/mappers";
import type { Job, JobStatus } from "@/modules/jobs/data/mappers";
import { REVERSE_STATUS_MAP } from "@/modules/jobs/data/mappers";

import { JobAddDialog } from "./components/job-add-dialog";
import { JobDetailPanel } from "./components/job-detail-panel";
import { JobKanbanBoard } from "./components/job-kanban-board";
import { JobTrackerToolbar } from "./components/job-tracker-toolbar";
import { mapManualFormToCreateRequest } from "./lib/map-job-form-to-request";
import {
  DEFAULT_JOB_TRACKER_FILTERS,
  JOB_TRACKER_COLUMNS,
  type JobTrackerFilters,
} from "./lib/job-tracker-types";
import { filterAndSortJobs, titleFromJobUrl } from "./lib/job-tracker-utils";

interface JobsPageClientProps {
  initialJobs: Job[];
  initialCvs: CvListItem[];
  user: NavbarUser | null;
}

export function JobsPageClient({
  initialJobs,
  initialCvs,
  user,
}: JobsPageClientProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobTrackerFilters>(
    DEFAULT_JOB_TRACKER_FILTERS
  );
  const [isPending, startTransition] = useTransition();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogStatus, setAddDialogStatus] = useState<JobStatus>("saved");
  const [jobPendingDelete, setJobPendingDelete] = useState<Job | null>(null);

  const navbarUser: NavbarUser = user ?? {
    email: "guest@prismacv.app",
    name: "Guest",
  };

  const visibleJobs = useMemo(
    () => filterAndSortJobs(jobs, filters),
    [jobs, filters]
  );

  const jobsByStatus = useMemo(() => {
    const grouped = Object.fromEntries(
      JOB_TRACKER_COLUMNS.map((status) => [status, [] as Job[]])
    ) as Record<JobStatus, Job[]>;

    for (const job of visibleJobs) {
      grouped[job.status].push(job);
    }

    return grouped;
  }, [visibleJobs]);

  function openAddDialog(status: JobStatus = "saved") {
    setAddDialogStatus(status);
    setAddDialogOpen(true);
  }

  function handleQuickAdd(url: string, status: JobStatus) {
    startTransition(async () => {
      const result = await createJobAction({
        title: titleFromJobUrl(url),
        company: "Imported",
        url,
        status: REVERSE_STATUS_MAP[status],
      });

      if (result.ok && result.data) {
        setJobs((prev) => [result.data!, ...prev]);
        setAddDialogOpen(false);
        toast.success(result.message);
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  const selectedJob =
    selectedJobId !== null
      ? (jobs.find((job) => job.id === selectedJobId) ?? null)
      : null;

  function handleManualAdd(data: ManualCreateJobFormData) {
    startTransition(async () => {
      const result = await createJobAction(mapManualFormToCreateRequest(data));

      if (result.ok && result.data) {
        setJobs((prev) => [result.data!, ...prev]);
        setAddDialogOpen(false);
        toast.success(result.message);
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  function handleStatusChange(jobId: string, newStatus: JobStatus) {
    const contractStatus = REVERSE_STATUS_MAP[newStatus];

    startTransition(async () => {
      const result = await updateJobStatusAction(jobId, {
        status: contractStatus,
      });
      if (result.ok && result.data) {
        setJobs((prev) =>
          prev.map((job) => (job.id === jobId ? result.data! : job))
        );
        toast.success(result.message);
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  function handleDeleteConfirm() {
    if (!jobPendingDelete) return;

    const deletingId = jobPendingDelete.id;

    startTransition(async () => {
      const result = await deleteJobAction(deletingId);
      if (result.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== deletingId));
        setJobPendingDelete(null);
        toast.success(result.message);
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <DashboardHeader
        user={navbarUser}
        title="Job Tracker"
        subtitle="Track every opportunity from saved to offer."
      />

      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="rounded-xl border border-subtle bg-surface-card p-4 shadow-card md:p-6">
            <JobTrackerToolbar
              filters={filters}
              onSearchChange={(search) =>
                setFilters((prev) => ({ ...prev, search }))
              }
              onSortApply={(sort) => setFilters((prev) => ({ ...prev, sort }))}
              onFiltersApply={(next) => setFilters(next)}
              onAddJob={() => openAddDialog("saved")}
            />
            <JobKanbanBoard
              jobsByStatus={jobsByStatus}
              onAddJob={openAddDialog}
              onSelectJob={setSelectedJobId}
              onStatusChange={handleStatusChange}
              onDelete={(jobId) => {
                const target = jobs.find((job) => job.id === jobId);
                if (target) setJobPendingDelete(target);
              }}
              isPending={isPending}
            />
          </div>
        </div>
      </div>

      <JobAddDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        initialStatus={addDialogStatus}
        isPending={isPending}
        cvs={initialCvs}
        onQuickAdd={handleQuickAdd}
        onManualAdd={handleManualAdd}
      />

      <JobDetailPanel
        job={selectedJob}
        cvs={initialCvs}
        open={selectedJob !== null}
        onClose={() => setSelectedJobId(null)}
        onJobUpdated={(updated) => {
          setJobs((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
        }}
      />

      <Dialog
        open={jobPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isPending) {
            setJobPendingDelete(null);
          }
        }}
      >
        <DialogContent aria-describedby="delete-job-dialog-description">
          <DialogHeader>
            <DialogTitle>Delete this job?</DialogTitle>
            <DialogDescription id="delete-job-dialog-description">
              {jobPendingDelete
                ? `This will remove "${jobPendingDelete.title}" at "${jobPendingDelete.company}" from your tracker.`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setJobPendingDelete(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
