"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FieldText } from "./field-text";

type InlineEditableTextTag = "h1" | "h2" | "p" | "span" | "div";

export interface InlineEditableTextProps {
  value: string;
  onChange: (next: string) => void;
  ariaLabel: string;
  placeholder?: string;
  as?: InlineEditableTextTag;
  className?: string;
  multiline?: boolean;
}

/**
 * Controlled click-to-edit text. Displays the value via the server core
 * (`FieldText`); on focus it swaps the same node for a native input that
 * inherits the surrounding typography, so editing happens in place rather than
 * in a floating overlay. Plain text only — rich bullets get a dedicated
 * contentEditable primitive. The owner supplies value + onChange, so this is
 * reused for personal info, experience entries, and any future section.
 */
export function InlineEditableText({
  value,
  onChange,
  ariaLabel,
  placeholder,
  as = "span",
  className,
  multiline = false,
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const assignRef = (
    element: HTMLInputElement | HTMLTextAreaElement | null
  ) => {
    editorRef.current = element;
  };

  // Move focus into the field when it enters edit mode, cursor at the end —
  // the rule-compliant alternative to autoFocus.
  useEffect(() => {
    if (!isEditing) return;
    const element = editorRef.current;
    if (!element) return;
    element.focus();
    const caret = element.value.length;
    element.setSelectionRange(caret, caret);
  }, [isEditing]);

  if (!isEditing) {
    return (
      <FieldText
        as={as}
        value={value}
        placeholder={placeholder}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        className={cn(
          "cursor-text rounded-sm transition duration-150 hover:bg-primary/5 hover:ring-1 hover:ring-primary/30 focus-visible:bg-primary/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30",
          className
        )}
        onClick={() => setIsEditing(true)}
        onFocus={() => setIsEditing(true)}
      />
    );
  }

  // Transparent fill keeps the inherited text colour readable on any surface;
  // the ring is the edit affordance (mirrors the shadcn Input focus style).
  const editingClassName = cn(
    "w-full rounded-sm bg-transparent outline-none ring-2 ring-ring/50 transition duration-150 [field-sizing:content]",
    className
  );

  if (multiline) {
    return (
      <textarea
        ref={assignRef}
        aria-label={ariaLabel}
        value={value}
        placeholder={placeholder}
        className={cn("resize-none", editingClassName)}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => setIsEditing(false)}
      />
    );
  }

  return (
    <input
      ref={assignRef}
      aria-label={ariaLabel}
      value={value}
      placeholder={placeholder}
      className={editingClassName}
      onChange={(event) => onChange(event.target.value)}
      onBlur={() => setIsEditing(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter") setIsEditing(false);
      }}
    />
  );
}
