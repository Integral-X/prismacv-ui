"use client";

import { FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreate: () => void;
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <FileText className="text-content-secondary mb-4 h-16 w-16 opacity-40" />
      <h2 className="text-content-primary mb-2 text-xl font-semibold">
        No CVs yet
      </h2>
      <p className="text-content-secondary mb-6 text-sm">
        Create your first CV to get started
      </p>
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Create CV
      </Button>
    </div>
  );
}
