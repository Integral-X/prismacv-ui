import type { TemplateProps } from "./index";
import {
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  ProjectEntry,
  ResumeHeader,
  Section,
  SkillGroups,
} from "./resume-sections";

/**
 * Display-only two-column resume (wide main + narrow sidebar) in the Enhancv
 * style. Pure and server-renderable — used by the preview, print, and public CV
 * paths so they ship none of the editor's client JS. The inline-editable
 * counterpart lives in `two-column-editable.tsx`.
 */
export function TwoColumnDisplay({ cv, accentColor }: TemplateProps) {
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
    <div className="mx-auto min-h-[297mm] w-[210mm] bg-white p-10 text-content-primary shadow-lg">
      {personalInfo && (
        <ResumeHeader info={personalInfo} accentColor={accentColor} />
      )}

      <div className="mt-6 grid grid-cols-3 gap-8">
        {/* Main column (wide, left) */}
        <div className="col-span-2 space-y-5">
          {personalInfo?.summary && (
            <Section title="Summary">
              <p className="text-xs leading-relaxed text-content-secondary">
                {personalInfo.summary}
              </p>
            </Section>
          )}

          {experiences.length > 0 && (
            <Section title="Experience">
              {experiences.map((exp) => (
                <ExperienceEntry
                  key={exp.id}
                  experience={exp}
                  accentColor={accentColor}
                />
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects">
              {projects.map((project) => (
                <ProjectEntry
                  key={project.id}
                  project={project}
                  accentColor={accentColor}
                />
              ))}
            </Section>
          )}
        </div>

        {/* Side column (narrow, right) */}
        <div className="col-span-1 space-y-5">
          {skills.length > 0 && (
            <Section title="Skills">
              <SkillGroups skills={skills} accentColor={accentColor} />
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education">
              {education.map((entry) => (
                <EducationEntry
                  key={entry.id}
                  education={entry}
                  accentColor={accentColor}
                />
              ))}
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="Certifications">
              {certifications.map((cert) => (
                <CertificationEntry key={cert.id} certification={cert} />
              ))}
            </Section>
          )}

          {languages.length > 0 && (
            <Section title="Languages">
              <div className="space-y-1">
                {languages.map((language) => (
                  <LanguageEntry key={language.id} language={language} />
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
