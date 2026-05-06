import { notFound } from 'next/navigation';
import { fetchCoverLetter } from '@/modules/cover-letters/data/mutations';
import { CoverLetterEditorClient } from './cover-letter-editor-client';

export const dynamic = 'force-dynamic';

interface EditCoverLetterPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoverLetterPage({
  params,
}: EditCoverLetterPageProps) {
  const { id } = await params;

  try {
    const coverLetter = await fetchCoverLetter(id);
    return <CoverLetterEditorClient coverLetter={coverLetter} />;
  } catch {
    notFound();
  }
}
