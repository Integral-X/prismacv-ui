import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type FieldTextTag = "h1" | "h2" | "p" | "span" | "div";

type FieldTextProps = {
  value: string | null;
  placeholder?: string;
  as?: FieldTextTag;
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

/**
 * Server-renderable presentation core for an editable field. This is all the
 * print and public CV routes ever ship — no store, no client runtime. The
 * client editing wrapper (`EditableText`) renders this in its display state and
 * swaps to an input only while focused, in `mode='edit'`.
 */
export function FieldText({
  value,
  placeholder,
  as: Tag = "span",
  className,
  ...rest
}: FieldTextProps) {
  const hasValue = Boolean(value && value.trim());
  return (
    <Tag
      className={cn(!hasValue && "text-content-tertiary", className)}
      {...rest}
    >
      {hasValue ? value : placeholder}
    </Tag>
  );
}
