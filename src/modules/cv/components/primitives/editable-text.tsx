"use client";

import { usePersonalInfoField } from "@/modules/cv/editor/editor-provider";
import type { PersonalInfoField } from "@/modules/cv/editor/editor-model";
import {
  InlineEditableText,
  type InlineEditableTextProps,
} from "./inline-editable-text";

interface EditableTextProps extends Omit<
  InlineEditableTextProps,
  "value" | "onChange"
> {
  field: PersonalInfoField;
}

/**
 * Binds the controlled `InlineEditableText` to a personal-info field in the
 * editor store: reads stay live, writes mark the section dirty and schedule a
 * debounced autosave.
 */
export function EditableText({ field, ...props }: EditableTextProps) {
  const { value, setValue } = usePersonalInfoField(field);
  return <InlineEditableText value={value} onChange={setValue} {...props} />;
}
