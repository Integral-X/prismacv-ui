import { notFound } from 'next/navigation';
import { getJobById } from '@/modules/jobs/data/queries';
import { HttpError } from '@/shared/http/http-error';
import { JobDetailClient } from './job-detail-client';

export const dynamic = 'force-dynamic';

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  try {
    const job = await getJobById(id);
    return <JobDetailClient job={job} />;
  } catch (error) {
    if (error instanceof HttpError && error.isNotFound) {
      notFound();
    }
    throw error;
  }
}
