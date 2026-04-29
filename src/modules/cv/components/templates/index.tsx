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
  '1': { layout: 'single', category: 'professional', accentColor: '#1a1a2e' },
  '2': { layout: 'two-column', category: 'modern', accentColor: '#0ea5e9' },
  '3': { layout: 'two-column', category: 'creative', accentColor: '#8b5cf6' },
  '4': { layout: 'single', category: 'professional', accentColor: '#374151' },
  '5': { layout: 'single', category: 'modern', accentColor: '#0d9488' },
  '6': { layout: 'two-column', category: 'creative', accentColor: '#e11d48' },
  '7': {
    layout: 'two-column',
    category: 'professional',
    accentColor: '#1e40af',
  },
  '8': { layout: 'single', category: 'modern', accentColor: '#475569' },
  '9': { layout: 'single', category: 'creative', accentColor: '#c026d3' },
};

export interface TemplateProps {
  cv: Cv;
  accentColor: string;
}

export function resolveTemplate(templateId: string | null | undefined) {
  const config = TEMPLATE_MAP[templateId ?? ''] ?? TEMPLATE_MAP['1'];
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
