"use client";

import { X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImportedProfile } from "./types";
import {
  getImportBorderColor,
  getImportBackgroundColor,
} from "../shared/utils/stateStyles";
import type { ImportState } from "../shared/utils/stateStyles";

interface LinkedInImportSuccessProps {
  importedProfile: ImportedProfile;
  state: ImportState;
  onRemove: () => void;
  className?: string;
}

export const LinkedInImportSuccess = ({
  importedProfile,
  state,
  onRemove,
  className,
}: LinkedInImportSuccessProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 rounded-lg p-6 transition-all duration-300",
          getImportBorderColor(state),
          getImportBackgroundColor(state)
        )}
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-full bg-feedback-success/15 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-feedback-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-content-primary truncate">
              {importedProfile.displayName}
            </p>
            <p className="text-sm text-content-muted truncate">
              {importedProfile.url}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="shrink-0"
          >
            <X className="w-5 h-5 text-content-muted" />
          </Button>
        </div>

        {/* Importing status */}
        <div className="mt-4 flex items-center gap-2 text-sm text-feedback-success">
          <div className="shrink-0 w-2 h-2 rounded-full bg-feedback-success animate-pulse" />
          <span>Importing your LinkedIn profile...</span>
        </div>
      </div>
    </div>
  );
};
