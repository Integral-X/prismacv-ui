"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { JobTrackerFilters } from "../lib/job-tracker-types";
import { JobFilterPopover } from "./job-filter-popover";
import { JobSortPopover } from "./job-sort-popover";

interface JobTrackerToolbarProps {
  filters: JobTrackerFilters;
  onSearchChange: (search: string) => void;
  onSortApply: (sort: JobTrackerFilters["sort"]) => void;
  onFiltersApply: (filters: JobTrackerFilters) => void;
  onAddJob: () => void;
}

export function JobTrackerToolbar({
  filters,
  onSearchChange,
  onSortApply,
  onFiltersApply,
  onAddJob,
}: JobTrackerToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-content-muted"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search jobs by keyword"
          value={filters.search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-9"
          aria-label="Search jobs by keyword"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <JobSortPopover
          sort={filters.sort}
          onApply={(sort) => onSortApply(sort)}
        />
        <JobFilterPopover
          filters={filters}
          onApply={(next) =>
            onFiltersApply({ ...filters, ...next, search: filters.search })
          }
        />
        <Button type="button" className="gap-2" onClick={onAddJob}>
          <Plus className="size-4" aria-hidden />
          Add Job
        </Button>
      </div>
    </div>
  );
}
