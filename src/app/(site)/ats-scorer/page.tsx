import { AtsScorerPageClient } from './ats-scorer-page-client';

export const metadata = {
  title: 'ATS match scorer | PrismaCV',
  description:
    'Score how well your resume text matches a job description before you apply.',
};

export default function AtsScorerPage() {
  return <AtsScorerPageClient />;
}
