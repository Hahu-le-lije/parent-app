/**
 * Normalizes EXPO_PUBLIC_API so we can append REST paths with a single leading slash.
 */
export function normalizeBaseUrl(raw: string | undefined): string {
  return (raw ?? "").replace(/\/$/, "");
}
