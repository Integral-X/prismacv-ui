"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Cv,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Certification,
  Project,
  Language,
} from "@/modules/cv/data/mappers";
import { updateCvAction } from "@/modules/cv/data/actions";
import type { UpdateCvRequest } from "@/modules/cv/data/contracts";
import type { BillingProfile } from "@/modules/billing/data/mappers";
import { queuePdfExportAction } from "@/modules/queue/data/actions";
import {
  toQueuePdfExportResult,
  type QueueJobState,
} from "@/modules/queue/data/mappers";
import { pollQueueJob } from "@/modules/queue/ui/poll-queue-job";
import { EditorHeader, type EditorPanel } from "./components/editor-header";
import { EditorMicroRail } from "./components/editor-micro-rail";
import { SectionWrapper } from "./components/section-wrapper";
import { PersonalInfoForm } from "./components/personal-info-form";
import { ExperienceForm } from "./components/experience-form";
import { EducationForm } from "./components/education-form";
import { SkillsForm } from "./components/skills-form";
import { CertificationsForm } from "./components/certifications-form";
import { ProjectsForm } from "./components/projects-form";
import { LanguagesForm } from "./components/languages-form";
import { CvPreviewPanel } from "@/modules/cv/components/cv-preview-panel";
import { templateSupportsInlineEditing } from "@/modules/cv/components/templates";
import { AiAnalysisPanel } from "./components/ai-analysis-panel";
import { AiOptimizePanel } from "./components/ai-optimize-panel";
import { CvSharePanel } from "./components/cv-share-panel";
import { EditorProvider, useLiveCv } from "@/modules/cv/editor/editor-provider";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { Badge } from "@/components/ui/badge";

interface CvEditorClientProps {
  cv: Cv;
  billing: BillingProfile;
}

const PANEL_TITLES: Record<EditorPanel, string> = {
  edit: "Content",
  analyze: "Analyze",
  optimize: "Optimize",
  share: "Share",
};

export function CvEditorClient({
  cv: initialCv,
  billing,
}: CvEditorClientProps) {
  const [cv, setCv] = useState<Cv>(initialCv);
  const [isPending, startTransition] = useTransition();
  const [exportState, setExportState] = useState<QueueJobState | null>(null);
  const [activePanel, setActivePanel] = useState<EditorPanel | null>("edit");
  const [isPreview, setIsPreview] = useState(false);

  // The two-column template edits personal info and experience inline on the
  // document; other templates fall back to the rail forms for those sections.
  const inlineEditing = templateSupportsInlineEditing(cv.templateId);
  const isExporting =
    exportState !== null &&
    exportState !== "completed" &&
    exportState !== "failed";

  function togglePanel(panel: EditorPanel) {
    setActivePanel((current) => (current === panel ? null : panel));
  }

  function handleTitleChange(title: string) {
    startTransition(async () => {
      const result = await updateCvAction(cv.id, { title });
      if (result.ok) {
        setCv((prev) => ({ ...prev, title }));
        toast.success("Title updated.");
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleStatusToggle() {
    const newStatus = cv.status === "draft" ? "PUBLISHED" : "DRAFT";
    startTransition(async () => {
      const input: UpdateCvRequest = { status: newStatus };
      const result = await updateCvAction(cv.id, input);
      if (result.ok) {
        setCv((prev) => ({
          ...prev,
          status: newStatus === "PUBLISHED" ? "published" : "draft",
        }));
        toast.success(
          newStatus === "PUBLISHED" ? "CV published." : "CV set to draft."
        );
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleExport() {
    startTransition(async () => {
      setExportState("waiting");
      const queued = await queuePdfExportAction({ cvId: cv.id });
      if (!queued.ok || !queued.data) {
        setExportState(null);
        toast.error(queued.ok ? "Unable to queue PDF export." : queued.message);
        return;
      }

      toast.success("PDF export queued.");

      try {
        const status = await pollQueueJob({
          jobId: queued.data.jobId,
          onStatus: (nextStatus) => setExportState(nextStatus.state),
        });

        if (status.state === "failed") {
          toast.error(status.error ?? "PDF export failed. Please try again.");
          return;
        }

        const pdf = toQueuePdfExportResult(status.result);
        if (!pdf) {
          toast.error("PDF export finished without a downloadable file.");
          return;
        }

        const bytes = Uint8Array.from(atob(pdf.base64), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: pdf.contentType });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = pdf.filename || `${cv.title || "cv"}.pdf`;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast.success("PDF export ready.");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to export the PDF. Please try again."
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
    <EditorProvider cv={cv}>
      <div className="flex h-dvh flex-col overflow-hidden bg-surface-primary">
        <EditorHeader
          cv={cv}
          onTitleChange={handleTitleChange}
          onStatusToggle={handleStatusToggle}
          isPending={isPending}
          activePanel={activePanel}
          onTogglePanel={togglePanel}
        />

        <div className="flex min-h-0 flex-1">
          <EditorMicroRail
            isPreview={isPreview}
            onTogglePreview={() => setIsPreview((value) => !value)}
            onExport={handleExport}
            isExporting={isExporting}
            shareActive={activePanel === "share"}
            onToggleShare={() => togglePanel("share")}
          />

          {activePanel && (
            <aside className="flex w-96 shrink-0 flex-col overflow-hidden border-r border-subtle bg-surface-primary">
              <div className="flex items-center justify-between border-b border-subtle px-4 py-3">
                <h2 className="text-sm font-semibold text-content-primary">
                  {PANEL_TITLES[activePanel]}
                </h2>
                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  aria-label="Close panel"
                  className="rounded p-1 text-content-secondary hover:bg-surface-card"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {billing.plan.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    AI {billing.aiQuota.used}/{billing.aiQuota.limit}
                  </Badge>
                </div>

                {activePanel === "edit" &&
                  (inlineEditing ? (
                    <div className="space-y-0.5">
                      <p className="mb-3 px-1 text-xs leading-relaxed text-content-secondary">
                        Click any text on the document to edit it inline.
                      </p>
                      {[
                        {
                          key: "personalInfo",
                          label: "Personal Info",
                          filled: !!cv.personalInfo?.fullName,
                        },
                        {
                          key: "experience",
                          label: "Experience",
                          filled: cv.experiences.length > 0,
                        },
                        {
                          key: "education",
                          label: "Education",
                          filled: cv.education.length > 0,
                        },
                        {
                          key: "skills",
                          label: "Skills",
                          filled: cv.skills.length > 0,
                        },
                        {
                          key: "projects",
                          label: "Projects",
                          filled: cv.projects.length > 0,
                        },
                        {
                          key: "certifications",
                          label: "Certifications",
                          filled: cv.certifications.length > 0,
                        },
                        {
                          key: "languages",
                          label: "Languages",
                          filled: cv.languages.length > 0,
                        },
                      ].map(({ key, label, filled }) => (
                        <div
                          key={key}
                          className="flex items-center gap-2.5 rounded px-2 py-1.5 text-xs text-content-secondary"
                        >
                          <span
                            className={cn(
                              "size-1.5 shrink-0 rounded-full",
                              filled
                                ? "bg-feedback-success"
                                : "bg-content-tertiary/30"
                            )}
                          />
                          {label}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <SectionWrapper
                        title="Personal Info"
                        count={cv.personalInfo ? 1 : 0}
                        defaultOpen
                      >
                        <PersonalInfoForm
                          cvId={cv.id}
                          initialData={cv.personalInfo}
                          onSaved={handlePersonalInfoSaved}
                        />
                      </SectionWrapper>

                      <SectionWrapper
                        title="Experience"
                        count={cv.experiences.length}
                      >
                        <ExperienceForm
                          cvId={cv.id}
                          initialData={cv.experiences}
                          onSaved={handleExperiencesSaved}
                        />
                      </SectionWrapper>

                      <SectionWrapper
                        title="Education"
                        count={cv.education.length}
                      >
                        <EducationForm
                          cvId={cv.id}
                          initialData={cv.education}
                          onSaved={handleEducationSaved}
                        />
                      </SectionWrapper>

                      <SectionWrapper title="Skills" count={cv.skills.length}>
                        <SkillsForm
                          cvId={cv.id}
                          initialData={cv.skills}
                          onSaved={handleSkillsSaved}
                        />
                      </SectionWrapper>

                      <SectionWrapper
                        title="Certifications"
                        count={cv.certifications.length}
                      >
                        <CertificationsForm
                          cvId={cv.id}
                          initialData={cv.certifications}
                          onSaved={handleCertificationsSaved}
                        />
                      </SectionWrapper>

                      <SectionWrapper
                        title="Projects"
                        count={cv.projects.length}
                      >
                        <ProjectsForm
                          cvId={cv.id}
                          initialData={cv.projects}
                          onSaved={handleProjectsSaved}
                        />
                      </SectionWrapper>

                      <SectionWrapper
                        title="Languages"
                        count={cv.languages.length}
                      >
                        <LanguagesForm
                          cvId={cv.id}
                          initialData={cv.languages}
                          onSaved={handleLanguagesSaved}
                        />
                      </SectionWrapper>
                    </div>
                  ))}

                {activePanel === "analyze" && (
                  <ErrorBoundary
                    boundary="editor-analyze"
                    label="analysis panel"
                  >
                    <AiAnalysisPanel
                      cvId={cv.id}
                      onClose={() => setActivePanel(null)}
                    />
                  </ErrorBoundary>
                )}

                {activePanel === "optimize" && (
                  <ErrorBoundary
                    boundary="editor-optimize"
                    label="optimization panel"
                  >
                    <AiOptimizePanel
                      cvId={cv.id}
                      onClose={() => setActivePanel(null)}
                    />
                  </ErrorBoundary>
                )}

                {activePanel === "share" && (
                  <ErrorBoundary boundary="editor-share" label="share panel">
                    <CvSharePanel cvId={cv.id} />
                  </ErrorBoundary>
                )}
              </div>
            </aside>
          )}

          {/* Document canvas — the critical core; isolate template crashes
              so a bad render degrades here instead of blanking the editor. */}
          <div className="flex min-h-0 flex-1 flex-col bg-surface-elevated">
            <ErrorBoundary boundary="editor-document" label="document preview">
              <DocumentPreview cv={cv} isPreview={isPreview} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}

/**
 * Renders the document canvas from the live editor draft (merged via `useLiveCv`)
 * rather than the stale server prop, so toggling to Preview reflects in-progress
 * inline edits. Lives inside `EditorProvider` so it can read the store.
 */
function DocumentPreview({ cv, isPreview }: { cv: Cv; isPreview: boolean }) {
  const liveCv = useLiveCv(cv);
  return (
    <CvPreviewPanel
      cv={liveCv}
      mode={isPreview ? "preview" : "edit"}
      initialScale={0.85}
    />
  );
}
