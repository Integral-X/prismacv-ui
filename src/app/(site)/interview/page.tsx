import {
  getInterviewQuestions,
  getInterviewRoles,
  getInterviewCategories,
} from "@/modules/interview/data/queries";
import { InterviewPageClient } from "./interview-page-client";

export const dynamic = "force-dynamic";

export default async function InterviewPage() {
  const [questions, roles, categories] = await Promise.all([
    getInterviewQuestions({ limit: 100 }),
    getInterviewRoles(),
    getInterviewCategories(),
  ]);

  return (
    <InterviewPageClient
      initialQuestions={questions}
      roles={roles}
      categories={categories}
    />
  );
}
