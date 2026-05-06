import { fetchCoverLetters } from '@/modules/cover-letters/data/mutations';
import { CoverLettersPageClient } from './cover-letters-page-client';

export const dynamic = 'force-dynamic';

export default async function CoverLettersPage() {
  const { data: coverLetters } = await fetchCoverLetters();
  return <CoverLettersPageClient initialCoverLetters={coverLetters} />;
}
