import type { Cv } from '@/modules/cv/data/mappers';
import { ClassicTemplate } from './classic-template';
import { TwoColumnDisplay } from './two-column-display';
import { CreativeTemplate } from './creative-template';

type TemplateLayout = 'single' | 'two-column';
type TemplateCategory = 'professional' | 'modern' | 'creative';

interface TemplateConfig {
  layout: TemplateLayout;
  category: TemplateCategory;
  accentColor: string;
}

const TEMPLATE_MAP: Record<string, TemplateConfig> = {
  classic: {
    layout: 'single',
    category: 'professional',
    accentColor: 'var(--color-content-primary)',
  },
  horizon: {
    layout: 'two-column',
    category: 'professional',
    accentColor: 'var(--color-primary)',
  },
  prism: {
    layout: 'two-column',
    category: 'modern',
    accentColor: 'var(--color-feedback-info)',
  },
  executive: {
    layout: 'single',
    category: 'professional',
    accentColor: 'var(--color-content-secondary)',
  },
  nova: {
    layout: 'single',
    category: 'modern',
    accentColor: 'var(--color-feedback-success)',
  },
  mosaic: {
    layout: 'two-column',
    category: 'creative',
    accentColor: 'var(--color-feedback-error)',
  },
  pinnacle: {
    layout: 'two-column',
    category: 'professional',
    accentColor: 'var(--color-primary)',
  },
  slate: {
    layout: 'single',
    category: 'modern',
    accentColor: 'var(--color-content-tertiary)',
  },
  vivid: {
    layout: 'single',
    category: 'creative',
    accentColor: 'var(--color-feedback-warning)',
  },
};

/** Whether the editor renders this template inline (edit) or read-only. */
export type RenderMode = 'edit' | 'preview';

export interface TemplateProps {
  cv: Cv;
  accentColor: string;
}

export function resolveTemplate(templateId: string | null | undefined) {
  const config = TEMPLATE_MAP[templateId ?? ''] ?? TEMPLATE_MAP['classic'];
  return config;
}

/**
 * Whether the resolved template has an inline-editable counterpart. Only the
 * two-column template is ported so far; classic/creative still use the rail
 * forms. Drives both the fallback editor and the edit-mode renderer.
 */
export function templateSupportsInlineEditing(
  templateId: string | null | undefined
): boolean {
  const config = resolveTemplate(templateId);
  return config.category !== 'creative' && config.layout === 'two-column';
}

/**
 * Display renderer — pure and server-safe. Used by the preview, print, and
 * public CV paths so they never ship the editor's client JS. Edit-mode
 * rendering goes through `EditableTemplateRenderer`.
 */
export function TemplateRenderer({
  cv,
  templateId,
}: {
  cv: Cv;
  templateId?: string | null;
}) {
  const config = resolveTemplate(templateId);

  if (config.category === 'creative') {
    return <CreativeTemplate cv={cv} accentColor={config.accentColor} />;
  }

  if (config.layout === 'two-column') {
    return <TwoColumnDisplay cv={cv} accentColor={config.accentColor} />;
  }

  return <ClassicTemplate cv={cv} accentColor={config.accentColor} />;
}
