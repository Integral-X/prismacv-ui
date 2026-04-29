import { getCvById, getTemplates } from '@/modules/cv/data/queries';
import { TemplateSelectionClient } from './template-selection-client';

export const dynamic = 'force-dynamic';

interface TemplateSelectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplateSelectionPage({
  params,
}: TemplateSelectionPageProps) {
  const { id } = await params;
  const [cv, templates] = await Promise.all([getCvById(id), getTemplates()]);

  return <TemplateSelectionClient cv={cv} templates={templates} />;
}
