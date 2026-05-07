'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
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
import { updateCvAction, exportCvPdfAction } from '@/modules/cv/data/actions';
import { analyzeCvAction } from '@/modules/ai/data/actions';
import type { CvAnalysisResult } from '@/modules/ai/data/mappers';
import type { UpdateCvRequest } from '@/modules/cv/data/contracts';
import { EditorHeader } from './components/editor-header';
import { SectionWrapper } from './components/section-wrapper';
import { PersonalInfoForm } from './components/personal-info-form';
import { ExperienceForm } from './components/experience-form';
import { EducationForm } from './components/education-form';
import { SkillsForm } from './components/skills-form';
import { CertificationsForm } from './components/certifications-form';
import { ProjectsForm } from './components/projects-form';
import { LanguagesForm } from './components/languages-form';
import { CvPreviewPanel } from '@/modules/cv/components/cv-preview-panel';
import { AnalysisPanel } from './components/analysis-panel';

interface CvEditorClientProps {
  cv: Cv;
}

export function CvEditorClient({ cv: initialCv }: CvEditorClientProps) {
  const [cv, setCv] = useState<Cv>(initialCv);
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<CvAnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function handleTitleChange(title: string) {
    startTransition(async () => {
      const result = await updateCvAction(cv.id, { title });
      if (result.ok) {
        setCv((prev) => ({ ...prev, title }));
        toast.success('Title updated.');
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleStatusToggle() {
    const newStatus = cv.status === 'draft' ? 'PUBLISHED' : 'DRAFT';
    startTransition(async () => {
      const input: UpdateCvRequest = { status: newStatus };
      const result = await updateCvAction(cv.id, input);
      if (result.ok) {
        setCv((prev) => ({
          ...prev,
          status: newStatus === 'PUBLISHED' ? 'published' : 'draft',
        }));
        toast.success(
          newStatus === 'PUBLISHED' ? 'CV published.' : 'CV set to draft.'
        );
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleExport() {
    startTransition(async () => {
      const result = await exportCvPdfAction(cv.id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      const bytes = Uint8Array.from(atob(result.base64), (c) =>
        c.charCodeAt(0)
      );
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cv.title || 'cv'}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  async function handleAnalyze() {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCvAction(cv.id);
      if (result.ok && result.data) {
        setAnalysisResult(result.data);
      } else if (!result.ok) {
        toast.error(result.message);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handlePersonalInfoSaved(data: PersonalInfo) {
    setCv((prev) => ({ ...prev, personalInfo: data }));
  }

  function handleExperiencesSaved(items: Experience[]) {
    setCv((prev) => ({ ...prev, experiences: items }));
  }

  function handleEducationSaved(items: Education[]) {
    setCv((prev) => ({ ...prev, education: items }));
  }

  function handleSkillsSaved(items: Skill[]) {
    setCv((prev) => ({ ...prev, skills: items }));
  }

  function handleCertificationsSaved(items: Certification[]) {
    setCv((prev) => ({ ...prev, certifications: items }));
  }

  function handleProjectsSaved(items: Project[]) {
    setCv((prev) => ({ ...prev, projects: items }));
  }

  function handleLanguagesSaved(items: Language[]) {
    setCv((prev) => ({ ...prev, languages: items }));
  }

  return (
    <div className='min-h-screen bg-surface-primary'>
      <EditorHeader
        cv={cv}
        onTitleChange={handleTitleChange}
        onStatusToggle={handleStatusToggle}
        onExport={handleExport}
        onAnalyze={handleAnalyze}
        isPending={isPending}
        isAnalyzing={isAnalyzing}
      />

      <div className='mx-auto max-w-7xl px-4 py-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Left panel — forms */}
          <div className='space-y-4 lg:col-span-2'>
            {analysisResult && (
              <AnalysisPanel
                result={analysisResult}
                onClose={() => setAnalysisResult(null)}
              />
            )}

            <SectionWrapper
              title='Personal Info'
              count={cv.personalInfo ? 1 : 0}
              defaultOpen
            >
              <PersonalInfoForm
                cvId={cv.id}
                initialData={cv.personalInfo}
                onSaved={handlePersonalInfoSaved}
              />
            </SectionWrapper>

            <SectionWrapper title='Experience' count={cv.experiences.length}>
              <ExperienceForm
                cvId={cv.id}
                initialData={cv.experiences}
                onSaved={handleExperiencesSaved}
              />
            </SectionWrapper>

            <SectionWrapper title='Education' count={cv.education.length}>
              <EducationForm
                cvId={cv.id}
                initialData={cv.education}
                onSaved={handleEducationSaved}
              />
            </SectionWrapper>

            <SectionWrapper title='Skills' count={cv.skills.length}>
              <SkillsForm
                cvId={cv.id}
                initialData={cv.skills}
                onSaved={handleSkillsSaved}
              />
            </SectionWrapper>

            <SectionWrapper
              title='Certifications'
              count={cv.certifications.length}
            >
              <CertificationsForm
                cvId={cv.id}
                initialData={cv.certifications}
                onSaved={handleCertificationsSaved}
              />
            </SectionWrapper>

            <SectionWrapper title='Projects' count={cv.projects.length}>
              <ProjectsForm
                cvId={cv.id}
                initialData={cv.projects}
                onSaved={handleProjectsSaved}
              />
            </SectionWrapper>

            <SectionWrapper title='Languages' count={cv.languages.length}>
              <LanguagesForm
                cvId={cv.id}
                initialData={cv.languages}
                onSaved={handleLanguagesSaved}
              />
            </SectionWrapper>
          </div>

          {/* Right panel — live preview */}
          <div className='lg:col-span-1'>
            <div className='sticky top-20'>
              <CvPreviewPanel cv={cv} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
