"use client";

import type { Job, JobStatus } from "@/modules/jobs/data/mappers";

import { JOB_TRACKER_COLUMNS } from "../lib/job-tracker-types";
import { JobKanbanColumn } from "./job-kanban-column";

interface JobKanbanBoardProps {
  jobsByStatus: Record<JobStatus, Job[]>;
  onAddJob: (status: JobStatus) => void;
  onSelectJob: (jobId: string) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onDelete: (jobId: string) => void;
  isPending: boolean;
}

export function JobKanbanBoard({
  jobsByStatus,
  onAddJob,
  onSelectJob,
  onStatusChange,
  onDelete,
  isPending,
}: JobKanbanBoardProps) {
  return (
    <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
      {JOB_TRACKER_COLUMNS.map((status) => (
        <JobKanbanColumn
          key={status}
          status={status}
          jobs={jobsByStatus[status]}
          onAddJob={onAddJob}
          onSelectJob={onSelectJob}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          isPending={isPending}
        />
      ))}
    </div>
  );
}
