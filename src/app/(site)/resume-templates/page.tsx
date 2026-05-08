import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/common/Footer';
import { getTemplates } from '@/modules/cv/data/queries';
import { HttpError } from '@/shared/http/http-error';
import { TemplatesGalleryClient } from '../templates/templates-gallery-client';

export const metadata: Metadata = {
  title: 'Resume Templates | PrismaCV',
  description: 'Browse modern and professional resume templates from PrismaCV.',
};

export const dynamic = 'force-dynamic';

export default async function ResumeTemplatesPage() {
  try {
    const templates = await getTemplates();

    return (
      <>
        <TemplatesGalleryClient templates={templates} />
        <Footer />
      </>
    );
  } catch (error) {
    if (error instanceof HttpError && error.isNotFound) {
      notFound();
    }
    throw error;
  }
}
