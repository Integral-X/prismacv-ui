"use client";

import { useState } from "react";
import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { JobTrackerFilters } from "../lib/job-tracker-types";

interface JobFilterPopoverProps {
  filters: JobTrackerFilters;
  onApply: (filters: JobTrackerFilters) => void;
}

function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function JobFilterPopover({ filters, onApply }: JobFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraft(filters);
    }
    setOpen(nextOpen);
  }

  function handleReset() {
    setDraft({
      ...draft,
      dateApplied: [],
      jobTypes: [],
      sources: [],
    });
  }

  function handleApply() {
    onApply(draft);
    setOpen(false);
  }

  const activeCount =
    draft.dateApplied.length + draft.jobTypes.length + draft.sources.length;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="gap-2">
          <ListFilter className="size-4" aria-hidden />
          Filter
          {activeCount > 0 ? (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-semibold text-content-primary">Filters</p>
          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-sm text-primary"
            onClick={handleReset}
          >
            Reset all
          </Button>
        </div>

        <FilterSection title="Date applied">
          {(
            [
              ["7", "Last 7 days"],
              ["14", "Last 14 days"],
              ["30", "Last 30 days"],
            ] as const
          ).map(([value, label]) => (
            <FilterCheckboxRow
              key={value}
              id={`filter-date-${value}`}
              label={label}
              checked={draft.dateApplied.includes(value)}
              onCheckedChange={() =>
                setDraft((prev) => ({
                  ...prev,
                  dateApplied: toggleValue(prev.dateApplied, value),
                }))
              }
            />
          ))}
        </FilterSection>

        <FilterSection title="Job type">
          {(
            [
              ["remote", "Remote"],
              ["onsite", "Onsite"],
              ["hybrid", "Hybrid"],
            ] as const
          ).map(([value, label]) => (
            <FilterCheckboxRow
              key={value}
              id={`filter-type-${value}`}
              label={label}
              checked={draft.jobTypes.includes(value)}
              onCheckedChange={() =>
                setDraft((prev) => ({
                  ...prev,
                  jobTypes: toggleValue(prev.jobTypes, value),
                }))
              }
            />
          ))}
        </FilterSection>

        <FilterSection title="Source">
          {(
            [
              ["linkedin", "LinkedIn"],
              ["facebook", "Facebook"],
              ["other", "Other"],
            ] as const
          ).map(([value, label]) => (
            <FilterCheckboxRow
              key={value}
              id={`filter-source-${value}`}
              label={label}
              checked={draft.sources.includes(value)}
              onCheckedChange={() =>
                setDraft((prev) => ({
                  ...prev,
                  sources: toggleValue(prev.sources, value),
                }))
              }
            />
          ))}
        </FilterSection>

        <Button
          type="button"
          variant="outline"
          className="mt-2 w-full border-primary text-primary hover:bg-primary/5"
          onClick={handleApply}
        >
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-semibold text-content-primary">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterCheckboxRow({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <label
        htmlFor={id}
        className="cursor-pointer text-sm text-content-primary"
      >
        {label}
      </label>
    </div>
  );
}
