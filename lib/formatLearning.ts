/**
 * Formats API ratios that may be 0–1 or 0–100 as a percentage label.
 */
export function formatRatioAsPercent(
  value: number | undefined | null,
): string {
  if (value == null || Number.isNaN(Number(value))) {
    return "0%";
  }
  const n = Number(value);
  const pct = n <= 1 && n >= 0 ? Math.round(n * 100) : Math.round(n);
  return `${Math.min(100, Math.max(0, pct))}%`;
}

export function formatShortDateTime(iso: string | undefined | null): string {
  if (!iso) {
    return "";
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatOptionalDateTime(
  iso: string | undefined | null,
): string | null {
  const s = formatShortDateTime(iso);
  return s.length > 0 ? s : null;
}
