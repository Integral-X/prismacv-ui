import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import type { TemplateProps } from './index';
import type { PersonalInfo, Skill } from '@/modules/cv/data/mappers';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatDateRange(
  start: Date,
  end: Date | null,
  current: boolean
): string {
  const startStr = formatDate(start);
  if (current) return `${startStr} – Present`;
  if (end) return `${startStr} – ${formatDate(end)}`;
  return startStr;
}

function SectionHeading({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <h2
      className='mb-3 border-b pb-1 text-sm font-semibold uppercase tracking-wider'
      style={{ borderColor: color, color }}
    >
      {children}
    </h2>
  );
}

export function ClassicTemplate({ cv, accentColor }: TemplateProps) {
  const {
    personalInfo,
    experiences,
    education,
    skills,
    certifications,
    projects,
    languages,
  } = cv;

  return (
    <div className='mx-auto min-h-[297mm] w-[210mm] bg-white p-8 text-black shadow-lg'>
      {personalInfo && <Header info={personalInfo} accentColor={accentColor} />}
      {experiences.length > 0 && (
        <Section title='Experience' color={accentColor}>
          {experiences.map((exp) => (
            <div key={exp.id} className='mb-3'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-sm font-semibold text-content-primary'>
                    {exp.title}
                  </p>
                  <p className='text-sm text-content-secondary'>
                    {exp.company}
                    {exp.location && (
                      <span className='text-content-tertiary'>
                        {' · '}
                        {exp.location}
                      </span>
                    )}
                  </p>
                </div>
                <span className='shrink-0 text-xs text-content-tertiary'>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              {exp.description && (
                <p className='mt-1 text-xs leading-relaxed text-content-secondary'>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}
      {education.length > 0 && (
        <Section title='Education' color={accentColor}>
          {education.map((edu) => (
            <div key={edu.id} className='mb-3'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-sm font-semibold text-content-primary'>
                    {edu.degree}
                    {edu.field && (
                      <span className='font-normal text-content-secondary'>
                        {' in '}
                        {edu.field}
                      </span>
                    )}
                  </p>
                  <p className='text-sm text-content-secondary'>
                    {edu.institution}
                  </p>
                </div>
                <span className='shrink-0 text-xs text-content-tertiary'>
                  {formatDateRange(edu.startDate, edu.endDate, false)}
                </span>
              </div>
              {edu.gpa && (
                <p className='mt-0.5 text-xs text-content-tertiary'>
                  GPA: {edu.gpa}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}
      {skills.length > 0 && (
        <Section title='Skills' color={accentColor}>
          <SkillsList skills={skills} />
        </Section>
      )}
      {certifications.length > 0 && (
        <Section title='Certifications' color={accentColor}>
          {certifications.map((cert) => (
            <div key={cert.id} className='mb-2'>
              <p className='text-sm font-semibold text-content-primary'>
                {cert.name}
              </p>
              <div className='flex items-center gap-2 text-xs text-content-tertiary'>
                {cert.issuer && <span>{cert.issuer}</span>}
                {cert.issueDate && <span>{formatDate(cert.issueDate)}</span>}
              </div>
            </div>
          ))}
        </Section>
      )}
      {projects.length > 0 && (
        <Section title='Projects' color={accentColor}>
          {projects.map((proj) => (
            <div key={proj.id} className='mb-3'>
              <div className='flex items-start justify-between'>
                <p className='text-sm font-semibold text-content-primary'>
                  {proj.name}
                </p>
                {proj.startDate && (
                  <span className='shrink-0 text-xs text-content-tertiary'>
                    {formatDateRange(proj.startDate, proj.endDate, false)}
                  </span>
                )}
              </div>
              {proj.description && (
                <p className='mt-1 text-xs leading-relaxed text-content-secondary'>
                  {proj.description}
                </p>
              )}
              {proj.url && (
                <p className='mt-0.5 text-xs text-interactive-link'>
                  {proj.url}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}
      {languages.length > 0 && (
        <Section title='Languages' color={accentColor}>
          <div className='flex flex-wrap gap-x-4 gap-y-1'>
            {languages.map((lang) => (
              <span key={lang.id} className='text-sm text-content-secondary'>
                {lang.name}
                <span className='ml-1 text-xs text-content-tertiary'>
                  ({lang.proficiency})
                </span>
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Header({
  info,
  accentColor,
}: {
  info: PersonalInfo;
  accentColor: string;
}) {
  const contacts: { icon: React.ReactNode; value: string }[] = [];
  if (info.email)
    contacts.push({ icon: <Mail className='h-3 w-3' />, value: info.email });
  if (info.phone)
    contacts.push({ icon: <Phone className='h-3 w-3' />, value: info.phone });
  if (info.location)
    contacts.push({
      icon: <MapPin className='h-3 w-3' />,
      value: info.location,
    });
  if (info.website)
    contacts.push({ icon: <Globe className='h-3 w-3' />, value: info.website });
  if (info.linkedinUrl)
    contacts.push({
      icon: <Linkedin className='h-3 w-3' />,
      value: info.linkedinUrl,
    });

  return (
    <div className='mb-6 border-b pb-4' style={{ borderColor: accentColor }}>
      {info.fullName && (
        <h1 className='text-2xl font-bold' style={{ color: accentColor }}>
          {info.fullName}
        </h1>
      )}
      {contacts.length > 0 && (
        <div className='mt-1 flex flex-wrap gap-3 text-xs text-content-secondary'>
          {contacts.map((c, i) => (
            <span key={i} className='flex items-center gap-1'>
              {c.icon}
              {c.value}
            </span>
          ))}
        </div>
      )}
      {info.summary && (
        <p className='mt-3 text-sm leading-relaxed text-content-secondary'>
          {info.summary}
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className='mb-5'>
      <SectionHeading color={color}>{title}</SectionHeading>
      {children}
    </div>
  );
}

function SkillsList({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category ?? 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className='space-y-2'>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          {Object.keys(grouped).length > 1 && (
            <p className='text-xs font-medium text-content-secondary'>
              {category}
            </p>
          )}
          <div className='mt-1 flex flex-wrap gap-1.5'>
            {items.map((skill) => (
              <span
                key={skill.id}
                className='rounded bg-surface-elevated px-2 py-0.5 text-xs text-content-secondary'
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
