"use client";

import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ManualCreateJobFormData } from "@/lib/validations/jobs";

import {
  JOB_EXPERTISE_OPTIONS,
  JOB_SOURCE_OPTIONS,
  JOB_STATUS_FORM_OPTIONS,
  JOB_TYPE_OPTIONS,
} from "../lib/job-form-constants";

interface JobManualFormFieldsProps {
  form: UseFormReturn<ManualCreateJobFormData>;
  showTitle?: boolean;
}

export function JobManualFormFields({
  form,
  showTitle = true,
}: JobManualFormFieldsProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      {showTitle ? (
        <div className="space-y-2">
          <Label htmlFor="job-title">Job Title</Label>
          <Input
            id="job-title"
            placeholder="Senior Frontend Developer"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          {errors.title ? (
            <p role="alert" className="text-xs text-feedback-error">
              {errors.title.message}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Company name</Label>
          <Input
            id="company"
            placeholder="TechCorp Inc"
            aria-invalid={!!errors.company}
            {...register("company")}
          />
          {errors.company ? (
            <p role="alert" className="text-xs text-feedback-error">
              {errors.company.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            {...register("location")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="job-type">Job Type</Label>
          <Select
            value={watch("jobType")}
            onValueChange={(value) =>
              setValue("jobType", value as ManualCreateJobFormData["jobType"])
            }
          >
            <SelectTrigger id="job-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="expertise">Expertise</Label>
          <Select
            value={watch("expertise") ?? ""}
            onValueChange={(value) =>
              setValue(
                "expertise",
                value as ManualCreateJobFormData["expertise"]
              )
            }
          >
            <SelectTrigger id="expertise">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {JOB_EXPERTISE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="applied-date">Applied Date</Label>
          <Input id="applied-date" type="date" {...register("appliedDate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="application-deadline">Application Deadline</Label>
          <Input
            id="application-deadline"
            type="date"
            {...register("applicationDeadline")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select
            value={watch("source")}
            onValueChange={(value) =>
              setValue("source", value as ManualCreateJobFormData["source"])
            }
          >
            <SelectTrigger id="source">
              <SelectValue placeholder="Select source" />
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
          <Label htmlFor="status">Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(value) =>
              setValue("status", value as ManualCreateJobFormData["status"])
            }
          >
            <SelectTrigger id="status">
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
        <Label htmlFor="job-link">Job Link</Label>
        <Input
          id="job-link"
          type="url"
          placeholder="https://..."
          aria-invalid={!!errors.url}
          {...register("url")}
        />
        {errors.url ? (
          <p role="alert" className="text-xs text-feedback-error">
            {errors.url.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-description">Job Description</Label>
        <Textarea
          id="job-description"
          placeholder="Paste or summarize the role..."
          className="min-h-[120px] resize-y"
          {...register("description")}
        />
      </div>
    </div>
  );
}
