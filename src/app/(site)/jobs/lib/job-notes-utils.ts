import type { Job } from "@/modules/jobs/data/mappers";

import type {
  JobExpertiseOption,
  JobSourceOption,
  JobTypeOption,
} from "./job-form-constants";

export interface ParsedJobNotes {
  description: string;
  expertise?: JobExpertiseOption;
  appliedDate?: string;
  applicationDeadline?: string;
  workTypeHybrid?: boolean;
}

export function parseJobNotes(notes: string | null): ParsedJobNotes {
  if (!notes?.trim()) {
    return { description: "" };
  }

  const lines = notes.split("\n\n");
  const metaLines: string[] = [];
  const bodyLines: string[] = [];

  for (const block of lines) {
    const trimmed = block.trim();
    if (
      trimmed.startsWith("Expertise:") ||
      trimmed.startsWith("Applied:") ||
      trimmed.startsWith("Deadline:") ||
      trimmed.startsWith("Work type:")
    ) {
      metaLines.push(trimmed);
    } else {
      bodyLines.push(trimmed);
    }
  }

  const expertise = metaLines
    .find((line) => line.startsWith("Expertise:"))
    ?.replace("Expertise:", "")
    .trim()
    .toLowerCase() as JobExpertiseOption | undefined;

  return {
    description: bodyLines.join("\n\n"),
    expertise:
      expertise === "intern" ||
      expertise === "junior" ||
      expertise === "mid" ||
      expertise === "senior"
        ? expertise
        : undefined,
    appliedDate: metaLines
      .find((line) => line.startsWith("Applied:"))
      ?.replace("Applied:", "")
      .trim(),
    applicationDeadline: metaLines
      .find((line) => line.startsWith("Deadline:"))
      ?.replace("Deadline:", "")
      .trim(),
    workTypeHybrid: metaLines.some((line) => line.includes("Hybrid")),
  };
}

export function jobTypeFromJob(job: Job): JobTypeOption {
  if (job.isRemote) return "remote";
  if (job.notes?.includes("Work type: Hybrid")) return "hybrid";
  return "onsite";
}

export function sourceFromJobUrl(url: string | null): JobSourceOption {
  if (!url) return "other";
  const normalized = url.toLowerCase();
  if (normalized.includes("linkedin")) return "linkedin";
  if (normalized.includes("facebook")) return "facebook";
  if (normalized.includes("instagram")) return "instagram";
  return "other";
}

export function inferSkillTags(title: string): string[] {
  const lower = title.toLowerCase();
  if (lower.includes("frontend") || lower.includes("developer")) {
    return ["React", "TypeScript", "Next.js", "User Research"];
  }
  if (lower.includes("designer") || lower.includes("product")) {
    return ["Figma", "User Research", "Wireframing", "Prototyping"];
  }
  return ["Communication", "Collaboration", "Problem solving"];
}
