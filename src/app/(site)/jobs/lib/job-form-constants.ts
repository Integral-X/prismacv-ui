export const JOB_TYPE_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On Site" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const JOB_EXPERTISE_OPTIONS = [
  { value: "intern", label: "Intern" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
] as const;

export const JOB_SOURCE_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "other", label: "Other" },
] as const;

export const JOB_STATUS_FORM_OPTIONS = [
  { value: "SAVED", label: "Saved" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
] as const;

export type JobTypeOption = (typeof JOB_TYPE_OPTIONS)[number]["value"];
export type JobExpertiseOption =
  (typeof JOB_EXPERTISE_OPTIONS)[number]["value"];
export type JobSourceOption = (typeof JOB_SOURCE_OPTIONS)[number]["value"];
