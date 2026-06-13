import type { ReactNode } from 'react';
import {
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from 'lucide-react';
import type {
  Certification,
  Education,
  Experience,
  Language,
  PersonalInfo,
  Project,
  Skill,
} from '@/modules/cv/data/mappers';

/**
 * Shared, display-only resume blocks in the Enhancv visual language (white
 * sheet, uppercase section rules, accent links, grouped skill chips, bulleted
 * descriptions). Every template composes these so the look stays consistent and
 * lives in one place. Pure/presentational — safe to render on the server (print
 * and public CV paths ship no extra client JS for them).
 */

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatDateRange(
  start: Date,
  end: Date | null,
  current: boolean
): string {
  const startStr = formatDate(start);
  if (current) return `${startStr} – Present`;
  if (end) return `${startStr} – ${formatDate(end)}`;
  return startStr;
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className='mb-2 border-b-2 border-content-primary pb-1 text-xs font-bold uppercase tracking-widest text-content-primary'>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ContactValue({
  icon: Icon,
  value,
  accentColor,
}: {
  icon: LucideIcon;
  value: string;
  accentColor: string;
}) {
  return (
    <span className='flex items-center gap-1'>
      <Icon className='h-3 w-3' style={{ color: accentColor }} />
      {value}
    </span>
  );
}

/** Display-only header (name + contact row). Inline-editable templates render
 *  their own editable header instead. */
export function ResumeHeader({
  info,
  accentColor,
}: {
  info: PersonalInfo;
  accentColor: string;
}) {
  return (
    <header className='border-b border-subtle pb-4'>
      {info.fullName && (
        <h1 className='text-3xl font-bold tracking-tight text-content-primary'>
          {info.fullName}
        </h1>
      )}
      <div className='mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary'>
        {info.phone && (
          <ContactValue
            icon={Phone}
            value={info.phone}
            accentColor={accentColor}
          />
        )}
        {info.email && (
          <ContactValue
            icon={Mail}
            value={info.email}
            accentColor={accentColor}
          />
        )}
        {info.website && (
          <ContactValue
            icon={Globe}
            value={info.website}
            accentColor={accentColor}
          />
        )}
        {info.linkedinUrl && (
          <ContactValue
            icon={Linkedin}
            value={info.linkedinUrl}
            accentColor={accentColor}
          />
        )}
        {info.location && (
          <ContactValue
            icon={MapPin}
            value={info.location}
            accentColor={accentColor}
          />
        )}
      </div>
    </header>
  );
}

export function BulletList({ text }: { text: string | null }) {
  if (!text) return null;
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  return (
    <ul className='mt-1 list-disc space-y-0.5 pl-4 text-xs leading-relaxed text-content-secondary'>
      {lines.map((line, index) => (
        <li key={`${index}-${line.slice(0, 12)}`}>{line}</li>
      ))}
    </ul>
  );
}

export function ExperienceEntry({
  experience,
  accentColor,
}: {
  experience: Experience;
  accentColor: string;
}) {
  return (
    <div className='mb-3'>
      <div className='flex items-baseline justify-between gap-2'>
        <p className='text-sm font-bold text-content-primary'>
          {experience.title}
        </p>
        <span className='shrink-0 text-xs text-content-tertiary'>
          {formatDateRange(
            experience.startDate,
            experience.endDate,
            experience.current
          )}
        </span>
      </div>
      <div className='flex items-center gap-2 text-xs'>
        <span className='font-semibold' style={{ color: accentColor }}>
          {experience.company}
        </span>
        {experience.location && (
          <span className='text-content-tertiary'>· {experience.location}</span>
        )}
      </div>
      <BulletList text={experience.description} />
    </div>
  );
}

export function ProjectEntry({
  project,
  accentColor,
}: {
  project: Project;
  accentColor: string;
}) {
  return (
    <div className='mb-3'>
      <p className='text-sm font-bold text-content-primary'>{project.name}</p>
      {project.url && (
        <p className='text-xs' style={{ color: accentColor }}>
          {project.url}
        </p>
      )}
      <BulletList text={project.description} />
    </div>
  );
}

export function EducationEntry({
  education,
  accentColor,
}: {
  education: Education;
  accentColor: string;
}) {
  return (
    <div className='mb-3'>
      <p className='text-xs font-bold text-content-primary'>
        {education.degree}
        {education.field && (
          <span className='font-normal text-content-secondary'>
            {' in '}
            {education.field}
          </span>
        )}
      </p>
      <p className='text-xs' style={{ color: accentColor }}>
        {education.institution}
      </p>
      <p className='text-xs text-content-tertiary'>
        {formatDateRange(education.startDate, education.endDate, false)}
      </p>
    </div>
  );
}

export function CertificationEntry({
  certification,
}: {
  certification: Certification;
}) {
  return (
    <div className='mb-2'>
      <p className='text-xs font-semibold text-content-primary'>
        {certification.name}
      </p>
      {certification.issuer && (
        <p className='text-xs text-content-tertiary'>{certification.issuer}</p>
      )}
    </div>
  );
}

export function LanguageEntry({ language }: { language: Language }) {
  return (
    <p className='text-xs text-content-secondary'>
      <span className='font-medium'>{language.name}</span>{' '}
      <span className='text-content-tertiary'>({language.proficiency})</span>
    </p>
  );
}

export function groupSkillsByCategory(
  skills: Skill[]
): [string | null, Skill[]][] {
  const groups = new Map<string | null, Skill[]>();
  for (const skill of skills) {
    const key = skill.category ?? null;
    const existing = groups.get(key) ?? [];
    existing.push(skill);
    groups.set(key, existing);
  }
  return Array.from(groups.entries());
}

export function SkillGroups({
  skills,
  accentColor,
}: {
  skills: Skill[];
  accentColor: string;
}) {
  const groups = groupSkillsByCategory(skills);
  return (
    <div className='space-y-3'>
      {groups.map(([category, items]) => (
        <div key={category ?? 'general'}>
          {category && (
            <p
              className='mb-1.5 text-xs font-semibold'
              style={{ color: accentColor }}
            >
              {category}
            </p>
          )}
          <div className='flex flex-wrap gap-1.5'>
            {items.map((skill) => (
              <span
                key={skill.id}
                className='rounded border border-subtle px-2 py-0.5 text-xs text-content-secondary'
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
