import { getCvById } from '@/modules/cv/data/queries';
import { CvEditorClient } from './cv-editor-client';

interface CvEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CvEditPage({ params }: CvEditPageProps) {
  const { id } = await params;
  const cv = await getCvById(id);

  return <CvEditorClient cv={cv} />;
}
