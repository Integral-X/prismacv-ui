import {
  getSkillCategories,
  getSkillRoles,
} from '@/modules/skills/data/queries';
import { SkillsPageClient } from './skills-page-client';

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  const [categories, roles] = await Promise.all([
    getSkillCategories(),
    getSkillRoles(),
  ]);

  return <SkillsPageClient categories={categories} roles={roles} />;
}
