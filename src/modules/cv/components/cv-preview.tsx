import type { Cv } from '@/modules/cv/data/mappers';
import { TemplateRenderer } from './templates';

interface CvPreviewProps {
  cv: Cv;
  templateId?: string | null;
}

/** Read-only resume render (preview, print, public). Server-safe. */
export function CvPreview({ cv, templateId }: CvPreviewProps) {
  return <TemplateRenderer cv={cv} templateId={templateId} />;
}
