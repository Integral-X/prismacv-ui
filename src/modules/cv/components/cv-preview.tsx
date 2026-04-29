'use client';

import type { Cv } from '@/modules/cv/data/mappers';
import { TemplateRenderer } from './templates';

interface CvPreviewProps {
  cv: Cv;
  templateId?: string | null;
}

export function CvPreview({ cv, templateId }: CvPreviewProps) {
  return <TemplateRenderer cv={cv} templateId={templateId} />;
}
