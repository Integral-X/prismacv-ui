import { getTemplates } from '@/modules/cv/data/queries';
import { TemplatesGalleryClient } from './templates-gallery-client';

export const revalidate = 3600; // revalidate template list every hour

export default async function TemplatesPage() {
  const templates = await getTemplates();
  return <TemplatesGalleryClient templates={templates} />;
}
