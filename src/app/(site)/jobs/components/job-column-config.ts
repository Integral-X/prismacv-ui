import type { JobStatus } from "@/modules/jobs/data/mappers";

export interface JobColumnTheme {
  label: string;
  headerClassName: string;
  dotClassName: string;
  addCardClassName: string;
}

export const JOB_COLUMN_THEMES: Record<JobStatus, JobColumnTheme> = {
  saved: {
    label: "Saved",
    headerClassName: "bg-feedback-info/10",
    dotClassName: "bg-feedback-info",
    addCardClassName: "border-feedback-info/30 bg-feedback-info/5",
  },
  applied: {
    label: "Applied",
    headerClassName: "bg-primary/10",
    dotClassName: "bg-primary",
    addCardClassName: "border-primary/30 bg-primary/5",
  },
  interview: {
    label: "Interview",
    headerClassName: "bg-feedback-warning/10",
    dotClassName: "bg-feedback-warning",
    addCardClassName: "border-feedback-warning/30 bg-feedback-warning/5",
  },
  offer: {
    label: "Offer",
    headerClassName: "bg-feedback-success/10",
    dotClassName: "bg-feedback-success",
    addCardClassName: "border-feedback-success/30 bg-feedback-success/5",
  },
  rejected: {
    label: "Rejected",
    headerClassName: "bg-feedback-error/10",
    dotClassName: "bg-feedback-error",
    addCardClassName: "border-feedback-error/30 bg-feedback-error/5",
  },
};
