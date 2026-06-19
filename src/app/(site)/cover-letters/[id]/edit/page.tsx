import { notFound } from "next/navigation";
import { fetchCoverLetter } from "@/modules/cover-letters/data/queries";
import { getUserCvs } from "@/modules/cv/data/queries";
import { CoverLetterEditorClient } from "./cover-letter-editor-client";

export const dynamic = "force-dynamic";

interface EditCoverLetterPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoverLetterPage({
  params,
}: EditCoverLetterPageProps) {
  const { id } = await params;

  try {
    const [coverLetter, userCvList] = await Promise.all([
      fetchCoverLetter(id),
      getUserCvs(1, 100),
    ]);
    const cvOptions = userCvList.items.map((cv) => ({
      id: cv.id,
      title: cv.title,
    }));

    return (
      <CoverLetterEditorClient
        coverLetter={coverLetter}
        cvOptions={cvOptions}
      />
    );
  } catch {
    notFound();
  }
}
