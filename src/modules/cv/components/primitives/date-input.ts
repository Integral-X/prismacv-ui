/** Shared helpers for the compact `<input type="date">` used by inline entry
 *  editors (experience, education, projects, certifications). */

export function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export function fromDateInputValue(value: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export const DATE_INPUT_CLASS =
  "rounded border border-subtle bg-transparent px-1 py-0.5 text-[10px] text-content-tertiary";
