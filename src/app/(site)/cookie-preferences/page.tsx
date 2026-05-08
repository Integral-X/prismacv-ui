import type { Metadata } from 'next';
import { Footer } from '@/components/common/Footer';
import { LegalDocumentPage } from '@/modules/legal/components/legal-document-page';
import { getLegalDocument } from '@/modules/legal/data/legal-content';

export const metadata: Metadata = {
  title: 'Cookie Preferences | PrismaCV',
  description: 'Learn which cookies PrismaCV uses and how to manage them.',
};

export default async function CookiePreferencesPage() {
  const document = await getLegalDocument('cookie-preferences');

  return (
    <>
      <LegalDocumentPage document={document} />
      <Footer />
    </>
  );
}
