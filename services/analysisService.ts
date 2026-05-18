import {
  DashboardStatus,
  Recommendation,
  RecommendationHistoryResponse,
} from "@/types/type";
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

export const getRecommendations = async (
  token: string,
  childId: string,
): Promise<Recommendation> => {
  const base = normalizeBaseUrl(process.env.EXPO_PUBLIC_API);
  const res = await fetch(
    parentChildUrl(base, childId, "/recommendation"),
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
        : "Failed to fetch recommendations from ai";
    throw new Error(msg);
  }
  return data as unknown as Recommendation;
};

export const getDashboardStatus = async (
  token: string,
  childId: string,
): Promise<DashboardStatus> => {
  const base = normalizeBaseUrl(process.env.EXPO_PUBLIC_API);
  const res = await fetch(
    parentChildUrl(base, childId, "/dashboard-status"),
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
        : "Failed to fetch dashboard status";
    throw new Error(msg);
  }
  return data as unknown as DashboardStatus;
};

export type RecommendationHistoryFetchResult =
  | { status: "ok"; data: RecommendationHistoryResponse }
  | { status: "forbidden"; message: string }
  | { status: "failed"; message: string };

export const getRecommendationHistory = async (
  token: string,
  childId: string,
): Promise<RecommendationHistoryFetchResult> => {
  const base = normalizeBaseUrl(process.env.EXPO_PUBLIC_API);
  const res = await fetch(
    parentChildUrl(base, childId, "/recommendation/history"),
    {
      method: "GET",
      headers: jsonHeaders(token),
    },
  );
  const data = await readJson(res);

  if (res.status === 403) {
    const msg =
      typeof data.message === "string" && data.message.length > 0
        ? data.message
        : "Recommendation history is available on a premium plan.";
    return { status: "forbidden", message: msg };
  }

  if (!res.ok) {
    const msg =
      typeof data.message === "string"
        ? data.message
        : "Failed to fetch recommendation history";
    return { status: "failed", message: msg };
  }

  const historyRaw = data.history;
  const history: RecommendationHistoryResponse["history"] = Array.isArray(
    historyRaw,
  )
    ? (historyRaw as RecommendationHistoryResponse["history"])
    : [];

  return {
    status: "ok",
    data: { history },
  };
};
