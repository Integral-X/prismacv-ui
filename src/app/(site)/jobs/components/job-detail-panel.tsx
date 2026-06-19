"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  MapPin,
  Pencil,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  updateJobDetailSchema,
  type UpdateJobDetailFormData,
} from "@/lib/validations/jobs";
import {
  updateJobAction,
  updateJobStatusAction,
} from "@/modules/jobs/data/actions";
import type { CvListItem } from "@/modules/cv/data/mappers";
import type { Job } from "@/modules/jobs/data/mappers";
import { REVERSE_STATUS_MAP } from "@/modules/jobs/data/mappers";

import {
  JOB_EXPERTISE_OPTIONS,
  JOB_SOURCE_OPTIONS,
  JOB_STATUS_FORM_OPTIONS,
  JOB_TYPE_OPTIONS,
} from "../lib/job-form-constants";
import { mapDetailFormToUpdateRequest } from "../lib/map-job-form-to-request";
import {
  inferSkillTags,
  jobTypeFromJob,
  parseJobNotes,
  sourceFromJobUrl,
} from "../lib/job-notes-utils";
import { JOB_COLUMN_THEMES } from "./job-column-config";
import { JobCvPicker } from "./job-cv-picker";

function jobToDetailForm(job: Job): UpdateJobDetailFormData {
  const parsed = parseJobNotes(job.notes);

  return {
    title: job.title,
    company: job.company,
    url: job.url ?? "",
    location: job.location ?? "",
    status: REVERSE_STATUS_MAP[job.status],
    jobType: jobTypeFromJob(job),
    source: sourceFromJobUrl(job.url),
    appliedDate: parsed.appliedDate ?? "",
    applicationDeadline: parsed.applicationDeadline ?? "",
    description: parsed.description,
  };
}

interface JobDetailPanelProps {
  job: Job | null;
  cvs: CvListItem[];
  open: boolean;
  onClose: () => void;
  onJobUpdated: (job: Job) => void;
}

export function JobDetailPanel({
  job,
  cvs,
  open,
  onClose,
  onJobUpdated,
}: JobDetailPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState(cvs[0]?.id ?? "");

  const form = useForm<UpdateJobDetailFormData>({
    resolver: zodResolver(updateJobDetailSchema),
    defaultValues: job ? jobToDetailForm(job) : undefined,
  });

  useEffect(() => {
    if (!job) return;
    form.reset(jobToDetailForm(job));
    setIsEditing(false);
    setShowFullDescription(false);
    setSelectedCvId(cvs[0]?.id ?? "");
  }, [job, cvs, form]);

  if (!job) return null;

  const parsed = parseJobNotes(job.notes);
  const skillTags = inferSkillTags(job.title);
  const expertiseLabel =
    JOB_EXPERTISE_OPTIONS.find((item) => item.value === parsed.expertise)
      ?.label ?? "Senior";
  const workTypeLabel =
    JOB_TYPE_OPTIONS.find((item) => item.value === jobTypeFromJob(job))
      ?.label ?? "Remote";
  const sourceLabel =
    JOB_SOURCE_OPTIONS.find((item) => item.value === sourceFromJobUrl(job.url))
      ?.label ?? "LinkedIn";

  function handleSave() {
    if (!job) return;
    const currentJob = job;
    form.handleSubmit((data) => {
      startTransition(async () => {
        const updateResult = await updateJobAction(
          currentJob.id,
          mapDetailFormToUpdateRequest(data)
        );

        if (!updateResult.ok) {
          toast.error(updateResult.message);
          return;
        }

        let updatedJob = updateResult.data!;

        if (REVERSE_STATUS_MAP[currentJob.status] !== data.status) {
          const statusResult = await updateJobStatusAction(currentJob.id, {
            status: data.status,
          });
          if (statusResult.ok && statusResult.data) {
            updatedJob = statusResult.data;
          }
        }

        onJobUpdated(updatedJob);
        setIsEditing(false);
        toast.success("Job saved.");
      });
    })();
  }

  const descriptionPreview =
    parsed.description.length > 180 && !showFullDescription
      ? `${parsed.description.slice(0, 180)}…`
      : parsed.description;

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-xl"
      >
        <SheetTitle className="sr-only">{job.title} details</SheetTitle>
        <SheetDescription className="sr-only">
          View and edit job application details
        </SheetDescription>

        <div className="border-b border-subtle px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            className="-ml-2 gap-2 px-2 text-content-secondary"
            onClick={onClose}
          >
            <ArrowLeft className="size-4" />
            Back to Tracker
          </Button>
        </div>

        <div className="flex-1 space-y-6 px-6 py-6">
          {isEditing ? (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="edit-title">Job title</Label>
                <Input id="edit-title" {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input id="edit-company" {...form.register("company")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-applied">Applied date</Label>
                  <Input
                    id="edit-applied"
                    type="date"
                    {...form.register("appliedDate")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-deadline">Application deadline</Label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    {...form.register("applicationDeadline")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select
                    value={form.watch("source")}
                    onValueChange={(value) =>
                      form.setValue(
                        "source",
                        value as UpdateJobDetailFormData["source"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_SOURCE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(value) =>
                      form.setValue(
                        "status",
                        value as UpdateJobDetailFormData["status"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_STATUS_FORM_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-url">Job Link</Label>
                <Input
                  id="edit-url"
                  type="url"
                  placeholder="https://..."
                  {...form.register("url")}
                />
              </div>
              <JobCvPicker
                cvs={cvs}
                selectedCvId={selectedCvId}
                onCvChange={setSelectedCvId}
              />
              <div className="space-y-2">
                <Label htmlFor="edit-description">Job description</Label>
                <Textarea
                  id="edit-description"
                  className="min-h-[140px]"
                  {...form.register("description")}
                />
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-content-primary">
                    {job.title}
                  </h2>
                  <p className="mt-1 text-content-secondary">{job.company}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Edit job"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="size-4" />
                </Button>
              </div>

              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-content-muted">Location</dt>
                  <dd className="mt-1 flex items-center gap-1 font-medium text-content-primary">
                    <MapPin className="size-3.5" />
                    {job.location ?? "Not set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-content-muted">Work Type</dt>
                  <dd className="mt-1 flex items-center gap-1 font-medium text-content-primary">
                    <Briefcase className="size-3.5" />
                    {workTypeLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-content-muted">Experience Level</dt>
                  <dd className="mt-1 flex items-center gap-1 font-medium text-content-primary">
                    <Users className="size-3.5" />
                    {expertiseLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-content-muted">Applied Date</dt>
                  <dd className="mt-1 flex items-center gap-1 font-medium text-content-primary">
                    <Calendar className="size-3.5" />
                    {parsed.appliedDate ||
                      (job.appliedAt
                        ? job.appliedAt.toLocaleDateString()
                        : "Not set")}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-content-muted uppercase">
                    Source
                  </p>
                  <Badge variant="outline" className="border-subtle">
                    {sourceLabel}
                  </Badge>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-content-muted uppercase">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-primary"
                  >
                    {JOB_COLUMN_THEMES[job.status].label}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-content-primary">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillTags.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-subtle text-content-secondary"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <JobCvPicker
                cvs={cvs}
                selectedCvId={selectedCvId}
                onCvChange={setSelectedCvId}
              />

              <div>
                <p className="mb-2 text-sm font-semibold text-content-primary">
                  Job Description
                </p>
                <p className="rounded-lg border border-subtle bg-surface-page p-4 text-sm leading-relaxed text-content-secondary">
                  {descriptionPreview ||
                    "No description yet. Edit this job to add details."}
                </p>
                {parsed.description.length > 180 ? (
                  <div className="mt-3 text-right">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/5"
                      onClick={() => setShowFullDescription((prev) => !prev)}
                    >
                      {showFullDescription
                        ? "Show less"
                        : "View Full Description"}
                    </Button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>

        {isEditing ? (
          <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-subtle bg-surface-card px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset(jobToDetailForm(job));
                setIsEditing(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
