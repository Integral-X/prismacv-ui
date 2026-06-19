import { notFound } from "next/navigation";
import { getCvById } from "@/modules/cv/data/queries";
import { getBillingProfile } from "@/modules/billing/data/queries";
import { HttpError } from "@/shared/http/http-error";
import { CvEditorClient } from "./cv-editor-client";

export const dynamic = "force-dynamic";

interface CvEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CvEditPage({ params }: CvEditPageProps) {
  const { id } = await params;
  try {
    const [cv, billing] = await Promise.all([
      getCvById(id),
      getBillingProfile(),
    ]);
    return <CvEditorClient cv={cv} billing={billing} />;
  } catch (error) {
    if (error instanceof HttpError && error.isNotFound) {
      notFound();
    }
    throw error;
  }
}
