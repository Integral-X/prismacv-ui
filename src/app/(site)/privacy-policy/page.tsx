import type { Metadata } from "next";
import { Footer } from "@/components/common/Footer";
import { LegalDocumentPage } from "@/modules/legal/components/legal-document-page";
import { getLegalDocument } from "@/modules/legal/data/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy | PrismaCV",
  description:
    "Read PrismaCV privacy practices and how we handle your personal data.",
};

export default async function PrivacyPolicyPage() {
  const document = await getLegalDocument("privacy-policy");

  return (
    <>
      <LegalDocumentPage document={document} />
      <Footer />
    </>
  );
}
