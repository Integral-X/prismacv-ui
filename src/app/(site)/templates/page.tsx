import { notFound } from 'next/navigation';
import { getTemplates } from '@/modules/cv/data/queries';
import { HttpError } from '@/shared/http/http-error';
import { TemplatesGalleryClient } from './templates-gallery-client';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  try {
    const templates = await getTemplates();
    return <TemplatesGalleryClient templates={templates} />;
  } catch (error) {
    if (error instanceof HttpError && error.isNotFound) {
      notFound();
    }
    throw error;
  }
}
