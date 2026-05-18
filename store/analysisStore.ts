import { create } from "zustand";
import {
  getRecommendations,
  getDashboardStatus,
  getRecommendationHistory,
} from "@/services/analysisService";

import {
  Recommendation,
  RecommendationHistoryResponse,
  DashboardStatus,
} from "@/types/type";

interface AIRecommendationStore {
  recommendation: Recommendation | null;
  history: RecommendationHistoryResponse | null;
  dashboard: DashboardStatus | null;

  loadingRecommendation: boolean;
  loadingHistory: boolean;
  loadingDashboard: boolean;

  recommendationError: string | null;
  historyError: string | null;
  historyPremiumLocked: boolean;
  dashboardError: string | null;

  fetchRecommendation: (childId: string, token: string) => Promise<void>;

  fetchHistory: (childId: string, token: string) => Promise<void>;

  fetchDashboardStatus: (childId: string, token: string) => Promise<void>;

  loadChildInsights: (childId: string, token: string) => Promise<void>;

  clearInsightErrors: () => void;

  reset: () => void;
}

export const useRecommendationStore = create<AIRecommendationStore>(
  (set, get) => ({
    recommendation: null,
    history: null,
    dashboard: null,

    loadingRecommendation: false,
    loadingHistory: false,
    loadingDashboard: false,

    recommendationError: null,
    historyError: null,
    historyPremiumLocked: false,
    dashboardError: null,

    fetchRecommendation: async (childId: string, token: string) => {
      try {
        set({
          loadingRecommendation: true,
          recommendationError: null,
          recommendation: null,
        });

        const data = await getRecommendations(token, childId);

        set({
          recommendation: data,
          loadingRecommendation: false,
        });
      } catch (error) {
        set({
          loadingRecommendation: false,
          recommendationError:
            error instanceof Error
              ? error.message
              : "Failed to fetch recommendation",
        });
      }
    },

    fetchHistory: async (childId: string, token: string) => {
      try {
        set({
          loadingHistory: true,
          historyError: null,
          historyPremiumLocked: false,
          history: null,
        });

        const result = await getRecommendationHistory(token, childId);

        if (result.status === "ok") {
          set({
            history: result.data,
            loadingHistory: false,
          });
          return;
        }

        if (result.status === "forbidden") {
          set({
            history: null,
            loadingHistory: false,
            historyPremiumLocked: true,
            historyError: result.message,
          });
          return;
        }

        set({
          history: null,
          loadingHistory: false,
          historyError: result.message,
        });
      } catch (error) {
        set({
          loadingHistory: false,
          historyError:
            error instanceof Error
              ? error.message
              : "Failed to fetch history",
        });
      }
    },

    fetchDashboardStatus: async (childId: string, token: string) => {
      try {
        set({
          loadingDashboard: true,
          dashboardError: null,
          dashboard: null,
        });

        const data = await getDashboardStatus(token, childId);

        set({
          dashboard: data,
          loadingDashboard: false,
        });
      } catch (error) {
        set({
          loadingDashboard: false,
          dashboardError:
            error instanceof Error
              ? error.message
              : "Failed to fetch dashboard status",
        });
      }
    },

    loadChildInsights: async (childId: string, token: string) => {
      await Promise.all([
        get().fetchRecommendation(childId, token),
        get().fetchHistory(childId, token),
        get().fetchDashboardStatus(childId, token),
      ]);
    },

    clearInsightErrors: () => {
      set({
        recommendationError: null,
        historyError: null,
        dashboardError: null,
      });
    },

    reset: () => {
      set({
        recommendation: null,
        history: null,
        dashboard: null,

        loadingRecommendation: false,
        loadingHistory: false,
        loadingDashboard: false,

        recommendationError: null,
        historyError: null,
        historyPremiumLocked: false,
        dashboardError: null,
      });
    },
  }),
);
