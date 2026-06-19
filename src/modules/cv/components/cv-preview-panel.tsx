"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Cv } from "@/modules/cv/data/mappers";
import { CvPreview } from "./cv-preview";
import { PaginatedSheet } from "./paginated-sheet";
import type { RenderMode } from "./templates";

// Code-split: the inline-editing renderer (and the editor store it pulls in) is
// only fetched in edit mode, so the preview/print/public paths never load it.
const EditableTemplateRenderer = dynamic(
  () =>
    import("./templates/editable-template-renderer").then((module) => ({
      default: module.EditableTemplateRenderer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto h-[297mm] w-[210mm] animate-pulse rounded bg-surface-card shadow-lg" />
    ),
  }
);

interface CvPreviewPanelProps {
  cv: Cv;
  mode?: RenderMode;
  initialScale?: number;
}

export function CvPreviewPanel({
  cv,
  mode,
  initialScale = 0.4,
}: CvPreviewPanelProps) {
  const [scale, setScale] = useState(initialScale);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-subtle px-4 py-2">
        <span className="text-sm font-medium text-content-secondary">
          {mode === "edit" ? "Editing" : "Preview"}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Zoom out"
            onClick={() =>
              setScale((s) => Math.max(0.25, +(s - 0.1).toFixed(1)))
            }
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-xs text-content-secondary">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Zoom in"
            onClick={() =>
              setScale((s) => Math.min(1.5, +(s + 0.1).toFixed(1)))
            }
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-surface-elevated p-4">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <PaginatedSheet>
            {mode === "edit" ? (
              <EditableTemplateRenderer cv={cv} />
            ) : (
              <CvPreview cv={cv} templateId={cv.templateId} />
            )}
          </PaginatedSheet>
        </div>
      </div>
    </div>
  );
}
