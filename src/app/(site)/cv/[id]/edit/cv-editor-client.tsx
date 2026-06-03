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
import { updateCvAction } from '@/modules/cv/data/actions';
import type { UpdateCvRequest } from '@/modules/cv/data/contracts';
import type { BillingProfile } from '@/modules/billing/data/mappers';
import { queuePdfExportAction } from '@/modules/queue/data/actions';
import {
  toQueuePdfExportResult,
  type QueueJobState,
} from '@/modules/queue/data/mappers';
import { pollQueueJob } from '@/modules/queue/ui/poll-queue-job';
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
import { AiAnalysisPanel } from './components/ai-analysis-panel';
import { AiOptimizePanel } from './components/ai-optimize-panel';
import { CvSharePanel } from './components/cv-share-panel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Target } from 'lucide-react';

interface CvEditorClientProps {
  cv: Cv;
  billing: BillingProfile;
}

export function CvEditorClient({
  cv: initialCv,
  billing,
}: CvEditorClientProps) {
  const [cv, setCv] = useState<Cv>(initialCv);
  const [isPending, startTransition] = useTransition();
  const [exportState, setExportState] = useState<QueueJobState | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showOptimizePanel, setShowOptimizePanel] = useState(false);

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
      setExportState('waiting');
      const queued = await queuePdfExportAction({ cvId: cv.id });
      if (!queued.ok || !queued.data) {
        setExportState(null);
        toast.error(queued.ok ? 'Unable to queue PDF export.' : queued.message);
        return;
      }

      toast.success('PDF export queued.');

      try {
        const status = await pollQueueJob({
          jobId: queued.data.jobId,
          onStatus: (nextStatus) => setExportState(nextStatus.state),
        });

        if (status.state === 'failed') {
          toast.error(status.error ?? 'PDF export failed. Please try again.');
          return;
        }

        const pdf = toQueuePdfExportResult(status.result);
        if (!pdf) {
          toast.error('PDF export finished without a downloadable file.');
          return;
        }

        const bytes = Uint8Array.from(atob(pdf.base64), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: pdf.contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdf.filename || `${cv.title || 'cv'}.pdf`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast.success('PDF export ready.');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to export the PDF. Please try again.'
        );
      } finally {
        setExportState(null);
      }
    });
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
        isPending={isPending}
        exportState={exportState}
      />

      <div className='mx-auto max-w-7xl px-4 py-6'>
        <div className='mb-4 flex flex-wrap items-center gap-2'>
          <Badge variant='secondary'>Plan: {billing.plan.toUpperCase()}</Badge>
          <Badge variant='outline'>
            AI quota: {billing.aiQuota.used}/{billing.aiQuota.limit}
          </Badge>
        </div>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Left panel — forms */}
          <div className='space-y-4 lg:col-span-2'>
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

          {/* Right panel — AI analysis & live preview */}
          <div className='lg:col-span-1'>
            <div className='sticky top-20 space-y-4'>
              {!showAiPanel && !showOptimizePanel && (
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => setShowAiPanel(true)}
                    className='flex flex-1 items-center justify-center gap-2 border-dashed'
                  >
                    <Sparkles className='size-4' />
                    Analyze
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => setShowOptimizePanel(true)}
                    className='flex flex-1 items-center justify-center gap-2 border-dashed'
                  >
                    <Target className='size-4' />
                    Optimize
                  </Button>
                </div>
              )}
              {showAiPanel && (
                <AiAnalysisPanel
                  cvId={cv.id}
                  onClose={() => setShowAiPanel(false)}
                />
              )}
              {showOptimizePanel && (
                <AiOptimizePanel
                  cvId={cv.id}
                  onClose={() => setShowOptimizePanel(false)}
                />
              )}
              <CvSharePanel cvId={cv.id} />
              <CvPreviewPanel cv={cv} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
