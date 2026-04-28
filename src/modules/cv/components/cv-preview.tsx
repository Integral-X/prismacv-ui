'use client';

import type {
  Cv,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Certification,
  Project,
  Language,
} from '@/modules/cv/data/mappers';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
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

// ─── Section Components ───────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className='mb-3 border-b border-gray-200 pb-1 text-sm font-semibold uppercase tracking-wider text-gray-800'>
      {children}
    </h2>
  );
}

function HeaderSection({ info }: { info: PersonalInfo }) {
  const contacts: { icon: React.ReactNode; value: string }[] = [];

  if (info.email) {
    contacts.push({
      icon: <Mail className='h-3 w-3' />,
      value: info.email,
    });
  }
  if (info.phone) {
    contacts.push({
      icon: <Phone className='h-3 w-3' />,
      value: info.phone,
    });
  }
  if (info.location) {
    contacts.push({
      icon: <MapPin className='h-3 w-3' />,
      value: info.location,
    });
  }
  if (info.website) {
    contacts.push({
      icon: <Globe className='h-3 w-3' />,
      value: info.website,
    });
  }
  if (info.linkedinUrl) {
    contacts.push({
      icon: <Linkedin className='h-3 w-3' />,
      value: info.linkedinUrl,
    });
  }

  return (
    <div className='mb-6 border-b border-gray-300 pb-4'>
      {info.fullName && (
        <h1 className='text-2xl font-bold text-gray-900'>{info.fullName}</h1>
      )}
      {contacts.length > 0 && (
        <div className='mt-1 flex flex-wrap gap-3 text-xs text-gray-600'>
          {contacts.map((c, i) => (
            <span key={i} className='flex items-center gap-1'>
              {c.icon}
              {c.value}
            </span>
          ))}
        </div>
      )}
      {info.summary && (
        <p className='mt-3 text-sm leading-relaxed text-gray-700'>
          {info.summary}
        </p>
      )}
    </div>
  );
}

function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <div className='mb-5'>
      <SectionHeading>Experience</SectionHeading>
      <div className='space-y-3'>
        {experiences.map((exp) => (
          <div key={exp.id}>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-sm font-semibold text-gray-900'>
                  {exp.title}
                </p>
                <p className='text-sm text-gray-700'>
                  {exp.company}
                  {exp.location && (
                    <span className='text-gray-500'>
                      {' · '}
                      {exp.location}
                    </span>
                  )}
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
      </div>
    </div>
  );
}

function EducationSection({ education }: { education: Education[] }) {
  return (
    <div className='mb-5'>
      <SectionHeading>Education</SectionHeading>
      <div className='space-y-3'>
        {education.map((edu) => (
          <div key={edu.id}>
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
                <p className='text-sm text-gray-700'>{edu.institution}</p>
              </div>
              <span className='shrink-0 text-xs text-gray-500'>
                {formatDateRange(edu.startDate, edu.endDate, false)}
              </span>
            </div>
            {edu.gpa && (
              <p className='mt-0.5 text-xs text-gray-500'>GPA: {edu.gpa}</p>
            )}
            {edu.description && (
              <p className='mt-1 text-xs leading-relaxed text-gray-600'>
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category ?? 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className='mb-5'>
      <SectionHeading>Skills</SectionHeading>
      <div className='space-y-2'>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            {Object.keys(grouped).length > 1 && (
              <p className='text-xs font-medium text-gray-700'>{category}</p>
            )}
            <div className='mt-1 flex flex-wrap gap-1.5'>
              {items.map((skill) => (
                <span
                  key={skill.id}
                  className='rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700'
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationsSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  return (
    <div className='mb-5'>
      <SectionHeading>Certifications</SectionHeading>
      <div className='space-y-2'>
        {certifications.map((cert) => (
          <div key={cert.id}>
            <p className='text-sm font-semibold text-gray-900'>{cert.name}</p>
            <div className='flex items-center gap-2 text-xs text-gray-500'>
              {cert.issuer && <span>{cert.issuer}</span>}
              {cert.issueDate && <span>{formatDate(cert.issueDate)}</span>}
              {cert.expiryDate && (
                <span>
                  {'· Expires '}
                  {formatDate(cert.expiryDate)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <div className='mb-5'>
      <SectionHeading>Projects</SectionHeading>
      <div className='space-y-3'>
        {projects.map((proj) => (
          <div key={proj.id}>
            <div className='flex items-start justify-between'>
              <p className='text-sm font-semibold text-gray-900'>{proj.name}</p>
              {proj.startDate && (
                <span className='shrink-0 text-xs text-gray-500'>
                  {formatDateRange(proj.startDate, proj.endDate, false)}
                </span>
              )}
            </div>
            {proj.description && (
              <p className='mt-1 text-xs leading-relaxed text-gray-600'>
                {proj.description}
              </p>
            )}
            {proj.url && (
              <p className='mt-0.5 text-xs text-blue-600'>{proj.url}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguagesSection({ languages }: { languages: Language[] }) {
  return (
    <div className='mb-5'>
      <SectionHeading>Languages</SectionHeading>
      <div className='flex flex-wrap gap-x-4 gap-y-1'>
        {languages.map((lang) => (
          <span key={lang.id} className='text-sm text-gray-700'>
            {lang.name}
            <span className='ml-1 text-xs text-gray-500'>
              ({lang.proficiency})
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CvPreviewProps {
  cv: Cv;
  templateId?: string | null;
}

export function CvPreview({ cv }: CvPreviewProps) {
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
    <div className='mx-auto w-[210mm] min-h-[297mm] bg-white p-8 text-black shadow-lg'>
      {personalInfo && <HeaderSection info={personalInfo} />}

      {experiences.length > 0 && (
        <ExperienceSection experiences={experiences} />
      )}

      {education.length > 0 && <EducationSection education={education} />}

      {skills.length > 0 && <SkillsSection skills={skills} />}

      {certifications.length > 0 && (
        <CertificationsSection certifications={certifications} />
      )}

      {projects.length > 0 && <ProjectsSection projects={projects} />}

      {languages.length > 0 && <LanguagesSection languages={languages} />}
    </div>
  );
}
