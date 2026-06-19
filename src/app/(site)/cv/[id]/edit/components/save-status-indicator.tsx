"use client";

import { Check, CloudUpload, RotateCw, TriangleAlert } from "lucide-react";
import {
  useEditorController,
  useEditorSelector,
} from "@/modules/cv/editor/editor-provider";
import {
  SECTION_KEYS,
  type SectionKey,
} from "@/modules/cv/editor/editor-model";
import type { SaveState } from "@/modules/cv/editor/editor-store";
import { cn } from "@/lib/utils";

/**
 * Aggregates the per-section save lifecycle into the four states the user sees.
 * `failed` wins over `saving` wins over `unsaved` — surface the most urgent
 * truth, and always tell the user their work is still here.
 */
function aggregate(sectionSave: Record<SectionKey, SaveState>): SaveState {
  const states = SECTION_KEYS.map((section) => sectionSave[section]);
  if (states.includes("failed")) return "failed";
  if (states.includes("saving")) return "saving";
  if (states.includes("unsaved")) return "unsaved";
  return "saved";
}

export function SaveStatusIndicator() {
  const sectionSave = useEditorSelector((state) => state.sectionSave);
  const controller = useEditorController();
  const status = aggregate(sectionSave);

  if (status === "failed") {
    return (
      <button
        type="button"
        onClick={() => {
          for (const section of SECTION_KEYS) {
            if (sectionSave[section] === "failed") controller.retry(section);
          }
        }}
        className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-feedback-error"
      >
        <TriangleAlert className="size-3.5" />
        Couldn&apos;t save
        <span className="flex items-center gap-1 underline">
          <RotateCw className="size-3" />
          Retry
        </span>
      </button>
    );
  }

  const presentation: Record<
    Exclude<SaveState, "failed">,
    { icon: typeof Check; label: string; className: string }
  > = {
    saving: {
      icon: CloudUpload,
      label: "Saving…",
      className: "text-content-secondary",
    },
    unsaved: {
      icon: CloudUpload,
      label: "Unsaved changes",
      className: "text-content-secondary",
    },
    saved: {
      icon: Check,
      label: "All changes saved",
      className: "text-content-tertiary",
    },
  };

  const { icon: Icon, label, className } = presentation[status];

  return (
    <span
      className={cn("flex items-center gap-1.5 text-xs font-medium", className)}
    >
      <Icon
        className={cn("size-3.5", status === "saving" && "animate-pulse")}
      />
      {label}
    </span>
  );
}
