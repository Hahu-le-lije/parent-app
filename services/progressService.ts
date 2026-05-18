import { Analytics, DailyProgress, WeeklyProgress } from "@/types/type";
import { normalizeBaseUrl } from "@/lib/parentApi";

const jsonHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

async function readJson(res: Response): Promise<Record<string, unknown>> {
  try {
    const data: unknown = await res.json();
    return data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function parentChildUrl(base: string, childId: string, path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}/parents/children/${childId}${suffix}`;
}

function assertRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid progress payload");
  }
  return value as Record<string, unknown>;
}

function unwrapDaily(body: unknown): DailyProgress {
  const root = assertRecord(body);
  if ("data" in root && root.data && typeof root.data === "object") {
    return body as DailyProgress;
  }
  return { data: body as DailyProgress["data"] };
}

function unwrapWeekly(body: unknown): WeeklyProgress {
  const root = assertRecord(body);
  if ("data" in root && root.data && typeof root.data === "object") {
    return body as WeeklyProgress;
  }
  return { data: body as WeeklyProgress["data"] };
}

function unwrapAnalytics(body: unknown): Analytics {
  const root = assertRecord(body);
  if ("data" in root && root.data && typeof root.data === "object") {
    const inner = assertRecord(root.data);
    if ("daily_summary" in inner && "weekly_summary" in inner) {
      return inner as unknown as Analytics;
    }
  }
  if ("daily_summary" in root && "weekly_summary" in root) {
    return body as Analytics;
  }
  throw new Error("Invalid analytics payload");
}

export const getDailyProgress = async (
  token: string,
  childId: string,
): Promise<DailyProgress> => {
  const base = normalizeBaseUrl(process.env.EXPO_PUBLIC_API);
  const res = await fetch(
    parentChildUrl(base, childId, "/daily-summary"),
    {
      method: "GET",
      headers: jsonHeaders(token),
    },
  );
  const data = await readJson(res);
  if (!res.ok) {
    const msg =
      typeof data.message === "string"
        ? data.message
        : "Failed to fetch daily progress";
    throw new Error(msg);
  }
  return unwrapDaily(data);
};

export const getWeeklyProgress = async (
  token: string,
  childId: string,
): Promise<WeeklyProgress> => {
  const base = normalizeBaseUrl(process.env.EXPO_PUBLIC_API);
  const res = await fetch(
    parentChildUrl(base, childId, "/weekly-summary"),
    {
      method: "GET",
      headers: jsonHeaders(token),
    },
  );
  const data = await readJson(res);
  if (!res.ok) {
    const msg =
      typeof data.message === "string"
        ? data.message
        : "Failed to fetch weekly progress";
    throw new Error(msg);
  }
  return unwrapWeekly(data);
};

export const getAnalytics = async (
  token: string,
  childId: string,
): Promise<Analytics> => {
  const base = normalizeBaseUrl(process.env.EXPO_PUBLIC_API);
  const res = await fetch(
    parentChildUrl(base, childId, "/analytics-overview"),
    {
      method: "GET",
      headers: jsonHeaders(token),
    },
  );
  const data = await readJson(res);
  if (!res.ok) {
    const msg =
      typeof data.message === "string"
        ? data.message
        : "Failed to fetch analytics overview";
    throw new Error(msg);
  }
  return unwrapAnalytics(data);
};
