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

function withAlpha(color: string, opacityPercent: number): string {
  return `color-mix(in srgb, ${color} ${opacityPercent}%, transparent)`;
}

export function CreativeTemplate({ cv, accentColor }: TemplateProps) {
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
      {/* Bold header with accent background */}
      {personalInfo && (
        <CreativeHeader info={personalInfo} accentColor={accentColor} />
      )}

      <div className='grid grid-cols-5 gap-0'>
        {/* Wide left column */}
        <div className='col-span-3 space-y-5 p-6 pl-8'>
          {experiences.length > 0 && (
            <TimelineSection title='Experience' color={accentColor}>
              {experiences.map((exp) => (
                <div key={exp.id} className='relative mb-4 pl-4'>
                  <div
                    className='absolute left-0 top-1.5 h-2 w-2 rounded-full'
                    style={{ backgroundColor: accentColor }}
                  />
                  <p className='text-sm font-semibold text-content-primary'>
                    {exp.title}
                  </p>
                  <p
                    className='text-xs font-medium'
                    style={{ color: accentColor }}
                  >
                    {exp.company}
                    {exp.location && ` · ${exp.location}`}
                  </p>
                  <p className='text-xs text-content-tertiary'>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </p>
                  {exp.description && (
                    <p className='mt-1 text-xs leading-relaxed text-content-secondary'>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </TimelineSection>
          )}
          {education.length > 0 && (
            <TimelineSection title='Education' color={accentColor}>
              {education.map((edu) => (
                <div key={edu.id} className='relative mb-4 pl-4'>
                  <div
                    className='absolute left-0 top-1.5 h-2 w-2 rounded-full'
                    style={{ backgroundColor: accentColor }}
                  />
                  <p className='text-sm font-semibold text-content-primary'>
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </p>
                  <p className='text-xs' style={{ color: accentColor }}>
                    {edu.institution}
                  </p>
                  <p className='text-xs text-content-tertiary'>
                    {formatDateRange(edu.startDate, edu.endDate, false)}
                  </p>
                </div>
              ))}
            </TimelineSection>
          )}
          {projects.length > 0 && (
            <TimelineSection title='Projects' color={accentColor}>
              {projects.map((proj) => (
                <div key={proj.id} className='relative mb-3 pl-4'>
                  <div
                    className='absolute left-0 top-1.5 h-2 w-2 rounded-full'
                    style={{ backgroundColor: accentColor }}
                  />
                  <p className='text-sm font-semibold text-content-primary'>
                    {proj.name}
                  </p>
                  {proj.description && (
                    <p className='mt-0.5 text-xs text-content-secondary'>
                      {proj.description}
                    </p>
                  )}
                  {proj.url && (
                    <p className='text-xs' style={{ color: accentColor }}>
                      {proj.url}
                    </p>
                  )}
                </div>
              ))}
            </TimelineSection>
          )}
        </div>

        {/* Narrow right sidebar */}
        <div
          className='col-span-2 space-y-5 p-6'
          style={{ backgroundColor: withAlpha(accentColor, 8) }}
        >
          {skills.length > 0 && (
            <SideSection title='Skills' color={accentColor}>
              <div className='flex flex-wrap gap-1.5'>
                {skills.map((skill) => (
                  <SkillChip key={skill.id} skill={skill} color={accentColor} />
                ))}
              </div>
            </SideSection>
          )}
          {certifications.length > 0 && (
            <SideSection title='Certifications' color={accentColor}>
              <div className='space-y-2'>
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className='text-xs font-semibold text-content-primary'>
                      {cert.name}
                    </p>
                    {cert.issuer && (
                      <p className='text-xs text-content-tertiary'>
                        {cert.issuer}
                      </p>
                    )}
                    {cert.issueDate && (
                      <p className='text-xs text-content-tertiary'>
                        {formatDate(cert.issueDate)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </SideSection>
          )}
          {languages.length > 0 && (
            <SideSection title='Languages' color={accentColor}>
              <div className='space-y-1'>
                {languages.map((lang) => (
                  <div
                    key={lang.id}
                    className='flex items-center justify-between'
                  >
                    <span className='text-xs font-medium text-content-secondary'>
                      {lang.name}
                    </span>
                    <span className='text-xs text-content-tertiary'>
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </SideSection>
          )}
        </div>
      </div>
    </div>
  );
}

function CreativeHeader({
  info,
  accentColor,
}: {
  info: PersonalInfo;
  accentColor: string;
}) {
  return (
    <div
      className='relative overflow-hidden p-8'
      style={{ backgroundColor: accentColor }}
    >
      <div
        className='absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20'
        style={{ backgroundColor: 'white' }}
      />
      <div
        className='absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-10'
        style={{ backgroundColor: 'white' }}
      />
      <div className='relative'>
        {info.fullName && (
          <h1 className='text-3xl font-bold text-white'>{info.fullName}</h1>
        )}
        <div className='mt-2 flex flex-wrap gap-3 text-xs text-white/80'>
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
          <p className='mt-4 text-sm leading-relaxed text-white/90'>
            {info.summary}
          </p>
        )}
      </div>
    </div>
  );
}

function TimelineSection({
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
        className='mb-3 text-sm font-bold uppercase tracking-wider'
        style={{ color }}
      >
        {title}
      </h2>
      <div className='border-l-2' style={{ borderColor: withAlpha(color, 30) }}>
        {children}
      </div>
    </div>
  );
}

function SideSection({
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

function SkillChip({ skill, color }: { skill: Skill; color: string }) {
  return (
    <span
      className='rounded-full px-2.5 py-0.5 text-xs font-medium text-white'
      style={{ backgroundColor: color }}
    >
      {skill.name}
    </span>
  );
}
