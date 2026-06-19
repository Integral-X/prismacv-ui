"use client";

import type { Cv } from "@/modules/cv/data/mappers";
import {
  resolveTemplate,
  templateSupportsInlineEditing,
  TemplateRenderer,
} from "./index";
import { TwoColumnEditable } from "./two-column-editable";

/**
 * Edit-mode renderer. Mounts the inline-editable template for ported templates
 * (two-column) and falls back to the read-only renderer otherwise. Lives behind
 * the editor canvas only, so the editor's client JS never reaches the preview,
 * print, or public CV paths (which go through the plain `TemplateRenderer`).
 */
export function EditableTemplateRenderer({ cv }: { cv: Cv }) {
  if (templateSupportsInlineEditing(cv.templateId)) {
    const { accentColor } = resolveTemplate(cv.templateId);
    return <TwoColumnEditable cv={cv} accentColor={accentColor} />;
  }

  return <TemplateRenderer cv={cv} templateId={cv.templateId} />;
}
