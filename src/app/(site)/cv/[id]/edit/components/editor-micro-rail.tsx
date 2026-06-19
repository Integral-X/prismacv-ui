"use client";

import { Download, Eye, Link2, Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorMicroRailProps {
  isPreview: boolean;
  onTogglePreview: () => void;
  onExport: () => void;
  isExporting: boolean;
  shareActive: boolean;
  onToggleShare: () => void;
}

/**
 * The compact vertical action rail pinned to the left edge of the document
 * (Enhancv pattern). Preview toggles the canvas between edit and read-only
 * (reusing the template `mode`); download and share map to existing actions.
 */
export function EditorMicroRail({
  isPreview,
  onTogglePreview,
  onExport,
  isExporting,
  shareActive,
  onToggleShare,
}: EditorMicroRailProps) {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-subtle bg-surface-primary py-3">
      <RailButton
        icon={Eye}
        label={isPreview ? "Exit preview" : "Preview"}
        active={isPreview}
        onClick={onTogglePreview}
      />
      <RailButton
        icon={isExporting ? Loader2 : Download}
        label="Download PDF"
        spinning={isExporting}
        disabled={isExporting}
        onClick={onExport}
      />
      <RailButton
        icon={Link2}
        label="Share"
        active={shareActive}
        onClick={onToggleShare}
      />
    </div>
  );
}

function RailButton({
  icon: Icon,
  label,
  active,
  spinning = false,
  disabled = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  spinning?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors",
        active
          ? "bg-surface-card text-content-primary"
          : "text-content-secondary hover:bg-surface-card",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <Icon className={cn("size-5", spinning && "animate-spin")} />
    </button>
  );
}
