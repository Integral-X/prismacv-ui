'use client';

import type { Cv } from '@/modules/cv/data/mappers';
import { ClassicTemplate } from './classic-template';
import { TwoColumnTemplate } from './two-column-template';
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
    accentColor: '#1a1a2e',
  },
  horizon: {
    layout: 'two-column',
    category: 'professional',
    accentColor: '#1e40af',
  },
  prism: { layout: 'two-column', category: 'modern', accentColor: '#0ea5e9' },
  executive: {
    layout: 'single',
    category: 'professional',
    accentColor: '#374151',
  },
  nova: { layout: 'single', category: 'modern', accentColor: '#0d9488' },
  mosaic: {
    layout: 'two-column',
    category: 'creative',
    accentColor: '#e11d48',
  },
  pinnacle: {
    layout: 'two-column',
    category: 'professional',
    accentColor: '#1e40af',
  },
  slate: { layout: 'single', category: 'modern', accentColor: '#475569' },
  vivid: { layout: 'single', category: 'creative', accentColor: '#c026d3' },
};

export interface TemplateProps {
  cv: Cv;
  accentColor: string;
}

export function resolveTemplate(templateId: string | null | undefined) {
  const config = TEMPLATE_MAP[templateId ?? ''] ?? TEMPLATE_MAP['classic'];
  return config;
}

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
    return <TwoColumnTemplate cv={cv} accentColor={config.accentColor} />;
  }

  return <ClassicTemplate cv={cv} accentColor={config.accentColor} />;
}
