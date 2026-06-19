"use client";

import { useRef, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

interface BulletEditorProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Structured bullet editor for CV description fields. Each newline-separated
 * line renders as an editable row with a bullet dot and a × remove button.
 * Keyboard shortcuts: Enter → add bullet below, Backspace on empty → remove.
 * Persists as the same `\n`-separated plain text the read-only `BulletList`
 * already consumes, so no data-layer changes are needed.
 */
export function BulletEditor({
  value,
  onChange,
  placeholder = "Add a bullet point…",
  ariaLabel,
  className,
}: BulletEditorProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const lines = value ? value.split("\n") : [""];

  function updateLine(index: number, text: string) {
    const next = [...lines];
    next[index] = text;
    onChange(next.join("\n"));
  }

  function addLine(afterIndex: number) {
    const next = [...lines];
    next.splice(afterIndex + 1, 0, "");
    onChange(next.join("\n"));
    requestAnimationFrame(() => {
      inputRefs.current[afterIndex + 1]?.focus();
    });
  }

  function removeLine(index: number) {
    if (lines.length <= 1) {
      onChange("");
      return;
    }
    const next = lines.filter((_, i) => i !== index);
    onChange(next.join("\n"));
    requestAnimationFrame(() => {
      inputRefs.current[Math.max(0, index - 1)]?.focus();
    });
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      addLine(index);
    } else if (event.key === "Backspace" && lines[index] === "") {
      event.preventDefault();
      removeLine(index);
    }
  }

  return (
    <div className={className} role="group" aria-label={ariaLabel}>
      <div className="space-y-0.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className="group/bullet -mx-1 flex items-start gap-1.5 rounded px-1 transition-colors duration-150 focus-within:bg-primary/5"
          >
            <span className="mt-[5px] size-1 shrink-0 rounded-full bg-content-tertiary opacity-60 transition-all duration-150 group-focus-within/bullet:scale-125 group-focus-within/bullet:bg-primary group-focus-within/bullet:opacity-100" />
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              value={line}
              onChange={(e) => updateLine(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              placeholder={i === 0 && lines.length === 1 ? placeholder : ""}
              aria-label={`Bullet point ${i + 1}`}
              className="w-full bg-transparent text-xs leading-relaxed text-content-secondary outline-none transition-colors duration-150 placeholder:text-content-tertiary focus:text-content-primary"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => removeLine(i)}
              aria-label="Remove bullet"
              className="mt-0.5 shrink-0 cursor-pointer text-content-tertiary opacity-0 transition-all duration-150 hover:text-feedback-error active:scale-90 group-hover/bullet:opacity-100"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => addLine(lines.length - 1)}
        className="group/add mt-1.5 flex cursor-pointer items-center gap-1 text-[10px] text-content-tertiary transition-colors duration-150 hover:text-content-secondary"
      >
        <Plus className="size-3 transition-transform duration-150 group-hover/add:rotate-90" />
        Add bullet
      </button>
    </div>
  );
}
