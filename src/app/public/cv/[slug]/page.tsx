import { notFound } from 'next/navigation';
import { getPublicCv } from '@/modules/cv/data/queries';
import { HttpError } from '@/shared/http/http-error';
import { PublicCvClient } from './public-cv-client';

export const dynamic = 'force-dynamic';

interface PublicCvPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicCvPage({ params }: PublicCvPageProps) {
  const { slug } = await params;

  try {
    const cv = await getPublicCv(slug);
    return <PublicCvClient cv={cv} />;
  } catch (error) {
    if (error instanceof HttpError && error.isNotFound) {
      notFound();
    }
    throw error;
  }
}
