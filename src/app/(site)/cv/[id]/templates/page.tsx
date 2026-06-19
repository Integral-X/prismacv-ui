import { notFound } from "next/navigation";
import { getCvById, getTemplates } from "@/modules/cv/data/queries";
import { HttpError } from "@/shared/http/http-error";
import { TemplateSelectionClient } from "./template-selection-client";

export const dynamic = "force-dynamic";

interface TemplateSelectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplateSelectionPage({
  params,
}: TemplateSelectionPageProps) {
  const { id } = await params;
  try {
    const [cv, templates] = await Promise.all([getCvById(id), getTemplates()]);

    return <TemplateSelectionClient cv={cv} templates={templates} />;
  } catch (error) {
    if (error instanceof HttpError && error.isNotFound) {
      notFound();
    }
    throw error;
  }
}
