'use client';

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

export function TwoColumnTemplate({ cv, accentColor }: TemplateProps) {
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
    <div className='mx-auto min-h-[297mm] w-[210mm] bg-white shadow-lg'>
      {/* Header spanning full width */}
      {personalInfo && (
        <div className='p-8 pb-4' style={{ backgroundColor: accentColor }}>
          <FullWidthHeader info={personalInfo} />
        </div>
      )}

      {/* Two-column body */}
      <div className='grid grid-cols-3 gap-0'>
        {/* Left sidebar */}
        <div className='col-span-1 space-y-5 bg-gray-50 p-6'>
          {skills.length > 0 && (
            <SidebarSection title='Skills' color={accentColor}>
              <div className='space-y-1'>
                {skills.map((skill) => (
                  <SkillBar key={skill.id} skill={skill} color={accentColor} />
                ))}
              </div>
            </SidebarSection>
          )}
          {languages.length > 0 && (
            <SidebarSection title='Languages' color={accentColor}>
              <div className='space-y-1'>
                {languages.map((lang) => (
                  <div key={lang.id} className='text-xs text-gray-700'>
                    <span className='font-medium'>{lang.name}</span>
                    <span className='ml-1 text-gray-500'>
                      ({lang.proficiency})
                    </span>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
          {certifications.length > 0 && (
            <SidebarSection title='Certifications' color={accentColor}>
              <div className='space-y-2'>
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className='text-xs font-medium text-gray-800'>
                      {cert.name}
                    </p>
                    {cert.issuer && (
                      <p className='text-xs text-gray-500'>{cert.issuer}</p>
                    )}
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
        </div>

        {/* Main content */}
        <div className='col-span-2 space-y-5 p-6'>
          {experiences.length > 0 && (
            <MainSection title='Experience' color={accentColor}>
              {experiences.map((exp) => (
                <div key={exp.id} className='mb-3'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-sm font-semibold text-gray-900'>
                        {exp.title}
                      </p>
                      <p className='text-xs text-gray-600'>
                        {exp.company}
                        {exp.location && ` · ${exp.location}`}
                      </p>
                    </div>
                    <span className='shrink-0 text-xs text-gray-500'>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className='mt-1 text-xs leading-relaxed text-gray-600'>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </MainSection>
          )}
          {education.length > 0 && (
            <MainSection title='Education' color={accentColor}>
              {education.map((edu) => (
                <div key={edu.id} className='mb-3'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-sm font-semibold text-gray-900'>
                        {edu.degree}
                        {edu.field && (
                          <span className='font-normal text-gray-700'>
                            {' in '}
                            {edu.field}
                          </span>
                        )}
                      </p>
                      <p className='text-xs text-gray-600'>{edu.institution}</p>
                    </div>
                    <span className='shrink-0 text-xs text-gray-500'>
                      {formatDateRange(edu.startDate, edu.endDate, false)}
                    </span>
                  </div>
                </div>
              ))}
            </MainSection>
          )}
          {projects.length > 0 && (
            <MainSection title='Projects' color={accentColor}>
              {projects.map((proj) => (
                <div key={proj.id} className='mb-3'>
                  <p className='text-sm font-semibold text-gray-900'>
                    {proj.name}
                  </p>
                  {proj.description && (
                    <p className='mt-0.5 text-xs leading-relaxed text-gray-600'>
                      {proj.description}
                    </p>
                  )}
                  {proj.url && (
                    <p className='text-xs text-blue-600'>{proj.url}</p>
                  )}
                </div>
              ))}
            </MainSection>
          )}
        </div>
      </div>
    </div>
  );
}

function FullWidthHeader({ info }: { info: PersonalInfo }) {
  return (
    <div>
      {info.fullName && (
        <h1 className='text-2xl font-bold text-white'>{info.fullName}</h1>
      )}
      <div className='mt-1 flex flex-wrap gap-3 text-xs text-white/80'>
        {info.email && (
          <span className='flex items-center gap-1'>
            <Mail className='h-3 w-3' /> {info.email}
          </span>
        )}
        {info.phone && (
          <span className='flex items-center gap-1'>
            <Phone className='h-3 w-3' /> {info.phone}
          </span>
        )}
        {info.location && (
          <span className='flex items-center gap-1'>
            <MapPin className='h-3 w-3' /> {info.location}
          </span>
        )}
        {info.website && (
          <span className='flex items-center gap-1'>
            <Globe className='h-3 w-3' /> {info.website}
          </span>
        )}
        {info.linkedinUrl && (
          <span className='flex items-center gap-1'>
            <Linkedin className='h-3 w-3' /> {info.linkedinUrl}
          </span>
        )}
      </div>
      {info.summary && (
        <p className='mt-3 text-sm leading-relaxed text-white/90'>
          {info.summary}
        </p>
      )}
    </div>
  );
}

function SidebarSection({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className='mb-2 text-xs font-bold uppercase tracking-wider'
        style={{ color }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function MainSection({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className='mb-3 border-b pb-1 text-sm font-semibold uppercase tracking-wider'
        style={{ borderColor: color, color }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

const LEVEL_WIDTHS: Record<string, string> = {
  BEGINNER: '25%',
  INTERMEDIATE: '50%',
  ADVANCED: '75%',
  EXPERT: '100%',
};

function SkillBar({ skill, color }: { skill: Skill; color: string }) {
  const width = LEVEL_WIDTHS[skill.level ?? 'INTERMEDIATE'] ?? '50%';
  return (
    <div>
      <span className='text-xs text-gray-700'>{skill.name}</span>
      <div className='mt-0.5 h-1.5 w-full rounded-full bg-gray-200'>
        <div
          className='h-full rounded-full'
          style={{ width, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
