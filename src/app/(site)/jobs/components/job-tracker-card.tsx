"use client";

import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  Linkedin,
  MapPin,
  MoreVertical,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Job, JobStatus } from "@/modules/jobs/data/mappers";

import { detectJobSource, formatTrackerDate } from "../lib/job-tracker-utils";
import { JOB_COLUMN_THEMES } from "./job-column-config";

interface JobTrackerCardProps {
  job: Job;
  onSelect: (jobId: string) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onDelete: (jobId: string) => void;
  isPending: boolean;
}

const STATUS_OPTIONS: JobStatus[] = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
];

function JobSourceIcon({ url }: { url: string | null }) {
  const source = detectJobSource(url);
  if (source === "linkedin") {
    return <Linkedin className="size-4 text-content-secondary" aria-hidden />;
  }
  return (
    <span
      className="flex size-4 items-center justify-center rounded-full bg-surface-elevated text-[10px] font-semibold text-content-muted"
      aria-hidden
    >
      W
    </span>
  );
}

export function JobTrackerCard({
  job,
  onSelect,
  onStatusChange,
  onDelete,
  isPending,
}: JobTrackerCardProps) {
  const appliedDate = job.appliedAt ?? job.createdAt;
  const sourceLabel =
    detectJobSource(job.url) === "linkedin"
      ? "LinkedIn"
      : detectJobSource(job.url) === "facebook"
        ? "Facebook"
        : "Web";

  return (
    <article className="relative rounded-xl border border-subtle bg-surface-card p-4 shadow-card">
      <div className="absolute top-3 right-3 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label={`Actions for ${job.title}`}
              disabled={isPending}
            >
              <MoreVertical className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1">
            <p className="px-2 py-1.5 text-xs font-semibold text-content-muted">
              Move to
            </p>
            {STATUS_OPTIONS.map((status) => (
              <Button
                key={status}
                type="button"
                variant="ghost"
                className="h-8 w-full justify-start px-2 text-sm font-normal"
                disabled={job.status === status || isPending}
                onClick={() => onStatusChange(job.id, status)}
              >
                {JOB_COLUMN_THEMES[status].label}
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              className="h-8 w-full justify-start px-2 text-sm font-normal text-feedback-error hover:text-feedback-error"
              disabled={isPending}
              onClick={() => onDelete(job.id)}
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <button
        type="button"
        className={cn(
          "w-full cursor-pointer pr-8 text-left",
          isPending && "cursor-not-allowed opacity-70"
        )}
        onClick={() => onSelect(job.id)}
        disabled={isPending}
      >
        <h3 className="truncate font-semibold text-content-primary">
          {job.title}
        </h3>
        <p className="truncate text-sm text-content-secondary">{job.company}</p>

        <ul className="mt-4 space-y-2 text-sm text-content-secondary">
          {job.location ? (
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{job.location}</span>
            </li>
          ) : null}
          <li className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0" aria-hidden />
            {job.status === "saved" ? (
              <span className="text-feedback-error">
                Deadline {formatTrackerDate(job.updatedAt)}
              </span>
            ) : job.status === "interview" ? (
              <span className="text-feedback-error">
                Interview {formatTrackerDate(job.updatedAt)}
              </span>
            ) : (
              <span>Applied {formatTrackerDate(appliedDate)}</span>
            )}
          </li>
          {job.status === "interview" ? (
            <li className="flex items-center gap-2">
              <Calendar className="size-4 shrink-0 opacity-0" aria-hidden />
              <span>Applied {formatTrackerDate(appliedDate)}</span>
            </li>
          ) : null}
          <li className="flex items-center gap-2">
            <JobSourceIcon url={job.url} />
            <span>{sourceLabel}</span>
          </li>
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.isRemote ? (
            <Badge
              variant="outline"
              className="border-subtle text-content-secondary"
            >
              Remote
            </Badge>
          ) : null}
          {!job.isRemote && job.location ? (
            <Badge
              variant="outline"
              className="border-subtle text-content-secondary"
            >
              Onsite
            </Badge>
          ) : null}
        </div>
      </button>

      {job.url ? (
        <div className="mt-4 text-center">
          <Link
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View Post
            <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        </div>
      ) : null}
    </article>
  );
}
