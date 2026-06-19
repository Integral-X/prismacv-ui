"use client";

/**
 * Compact month + year selector for CV entry dates. CV dates carry month/year
 * precision only — using a full `<input type="date">` exposes an unnecessary
 * day picker. Two small selects (MM / YYYY) give a cleaner, less ambiguous UX.
 *
 * Dates are constructed and stored as UTC midnight so they round-trip correctly
 * with the rest of the data layer (which also uses UTC midnight via ISO string).
 */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 56 }, (_, i) => CURRENT_YEAR + 5 - i);

const SELECT_CLASS =
  "cursor-pointer rounded border border-subtle bg-transparent px-1 py-0.5 text-[10px] text-content-tertiary outline-none transition duration-150 hover:border-primary/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/20";

interface MonthYearInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  "aria-label"?: string;
}

export function MonthYearInput({
  value,
  onChange,
  "aria-label": ariaLabel,
}: MonthYearInputProps) {
  // Use UTC accessors to match the UTC-midnight storage convention.
  const selectedMonth = value !== null ? value.getUTCMonth() + 1 : ""; // 1–12 or ''
  const selectedYear = value !== null ? value.getUTCFullYear() : ""; // YYYY or ''

  function handleMonthChange(raw: string) {
    if (!raw) {
      onChange(null);
      return;
    }
    const m = parseInt(raw, 10);
    const y = selectedYear !== "" ? Number(selectedYear) : CURRENT_YEAR;
    onChange(new Date(Date.UTC(y, m - 1, 1)));
  }

  function handleYearChange(raw: string) {
    if (!raw) {
      onChange(null);
      return;
    }
    const y = parseInt(raw, 10);
    const m = selectedMonth !== "" ? Number(selectedMonth) : 1;
    onChange(new Date(Date.UTC(y, m - 1, 1)));
  }

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={ariaLabel}>
      <select
        value={selectedMonth}
        onChange={(e) => handleMonthChange(e.target.value)}
        className={SELECT_CLASS}
        aria-label={ariaLabel ? `${ariaLabel} month` : "Month"}
      >
        <option value="">MM</option>
        {MONTHS.map((name, i) => (
          <option key={name} value={i + 1}>
            {name}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => handleYearChange(e.target.value)}
        className={SELECT_CLASS}
        aria-label={ariaLabel ? `${ariaLabel} year` : "Year"}
      >
        <option value="">YYYY</option>
        {YEAR_OPTIONS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </span>
  );
}
