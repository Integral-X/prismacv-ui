import type { Metadata } from 'next';
import { Footer } from '@/components/common/Footer';
import { LegalDocumentPage } from '@/modules/legal/components/legal-document-page';
import { getLegalDocument } from '@/modules/legal/data/legal-content';

export const metadata: Metadata = {
  title: 'Terms of Service | PrismaCV',
  description: 'Review PrismaCV terms for plans, usage, and service limits.',
};

export default async function TermsOfServicePage() {
  const document = await getLegalDocument('terms-of-service');

  return (
    <>
      <LegalDocumentPage document={document} />
      <Footer />
    </>
  );
}
