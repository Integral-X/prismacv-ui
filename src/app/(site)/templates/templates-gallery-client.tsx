"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { CvTemplate } from "@/modules/cv/data/mappers";
import { createCvAction } from "@/modules/cv/data/actions";

type CategoryFilter = "all" | "professional" | "modern" | "creative";

interface TemplatesGalleryClientProps {
  templates: CvTemplate[];
}

export function TemplatesGalleryClient({
  templates,
}: TemplatesGalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(
    null
  );
  const router = useRouter();

  const filtered =
    activeFilter === "all"
      ? templates
      : templates.filter((t) => t.category === activeFilter);

  const filters: { label: string; value: CategoryFilter }[] = [
    { label: "All Templates", value: "all" },
    { label: "Professional", value: "professional" },
    { label: "Modern", value: "modern" },
    { label: "Creative", value: "creative" },
  ];

  const toTemplateSelection = (templateId: string): string =>
    `/onboarding/select-template?templateId=${encodeURIComponent(templateId)}`;

  function toLoginWithTemplateRedirect(templateId: string): string {
    const redirectPath = toTemplateSelection(templateId);
    return `/login?redirect=${encodeURIComponent(redirectPath)}`;
  }

  async function handleUseTemplate(template: CvTemplate): Promise<void> {
    setPendingTemplateId(template.id);

    const result = await createCvAction({
      title: `${template.name} Resume`,
      templateId: template.id,
    });

    setPendingTemplateId(null);

    if (result.ok && result.redirectTo) {
      router.push(result.redirectTo);
      return;
    }

    if (!result.ok && result.code === "unauthorized") {
      router.push(toLoginWithTemplateRedirect(template.id));
      return;
    }

    if (!result.ok) {
      toast.error(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-surface-primary">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-content-primary">
            Resume Templates
          </h1>
          <p className="mt-2 text-content-secondary">
            Choose from professionally designed templates to make your resume
            stand out
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex justify-center gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={activeFilter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(f.value)}
              aria-pressed={activeFilter === f.value}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <div
              key={template.id}
              role="button"
              tabIndex={0}
              aria-label={`${template.name} template`}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  void handleUseTemplate(template);
                }
              }}
              className="group overflow-hidden rounded-lg border border-border-subtle bg-surface-card transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] overflow-hidden bg-surface-elevated">
                <Image
                  src={template.thumbnail}
                  alt={`${template.name} template preview`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-content-primary">
                    {template.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {template.category}
                  </Badge>
                </div>
                <div className="mt-2 flex gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      "bg-surface-primary text-content-secondary"
                    )}
                  >
                    {template.layout === "single"
                      ? "Single Column"
                      : "Two Columns"}
                  </span>
                  {template.hasHeadshot && (
                    <span className="rounded-full bg-surface-primary px-2 py-0.5 text-xs text-content-secondary">
                      Headshot
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => {
                    void handleUseTemplate(template);
                  }}
                  disabled={pendingTemplateId !== null}
                >
                  {pendingTemplateId === template.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  Use this template
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-content-secondary">
            No templates found for this category.
          </div>
        )}
      </div>
    </div>
  );
}
