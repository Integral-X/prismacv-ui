"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SettingsToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function SettingsToggleRow({
  title,
  description,
  checked,
  disabled = false,
  onCheckedChange,
  className,
}: SettingsToggleRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-subtle py-4 last:border-b-0 last:pb-0 first:pt-0",
        className
      )}
    >
      <div className="min-w-0">
        <p className="font-medium text-content-primary">{title}</p>
        <p className="text-sm text-content-secondary">{description}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={title}
      />
    </div>
  );
}
