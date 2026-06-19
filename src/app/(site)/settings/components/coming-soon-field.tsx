import { Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ComingSoonFieldProps {
  id: string;
  label: string;
  placeholder: string;
}

export function ComingSoonField({
  id,
  label,
  placeholder,
}: ComingSoonFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-content-primary">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        disabled
        aria-describedby={`${id}-hint`}
      />
      <p
        id={`${id}-hint`}
        className="flex items-center gap-1.5 text-xs text-content-muted"
      >
        <Info className="size-3.5 shrink-0" aria-hidden />
        Coming soon — not saved to your account yet.
      </p>
    </div>
  );
}
