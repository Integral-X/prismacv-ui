import {
  getSkillRoles,
  getUserProgress,
} from '@/modules/skills/data/queries';
import { RoadmapPageClient } from './roadmap-page-client';

export const dynamic = 'force-dynamic';

export default async function SkillsRoadmapPage() {
  const [roles, progress] = await Promise.all([
    getSkillRoles(),
    getUserProgress(),
  ]);

  return <RoadmapPageClient roles={roles} initialProgress={progress} />;
}
