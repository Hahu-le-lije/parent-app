import { create } from "zustand";
import {
    getRecommendations,
    dashboardStatus,
    recommendationHistory,
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

    error: string | null;

    fetchRecommendation: (
        childId: string,
        token: string
    ) => Promise<void>;

    fetchHistory: (
        childId: string,
        token: string
    ) => Promise<void>;

    fetchDashboardStatus: (
        childId: string,
        token: string
    ) => Promise<void>;

    clearError: () => void;

    reset: () => void;
}

export const useRecommendationStore =
    create<AIRecommendationStore>((set) => ({
        recommendation: null,
        history: null,
        dashboard: null,

        loadingRecommendation: false,
        loadingHistory: false,
        loadingDashboard: false,

        error: null,

        fetchRecommendation: async (
            childId: string,
            token: string
        ) => {
            try {
                set({
                    loadingRecommendation: true,
                    error: null,
                });

                const data = await getRecommendations(
                    childId,
                    token
                );

                set({
                    recommendation: data,
                    loadingRecommendation: false,
                });
            } catch (error) {
                set({
                    loadingRecommendation: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch recommendation",
                });
            }
        },

        fetchHistory: async (
            childId: string,
            token: string
        ) => {
            try {
                set({
                    loadingHistory: true,
                    error: null,
                });

                const data = await recommendationHistory(
                    childId,
                    token
                );

                set({
                    history: data,
                    loadingHistory: false,
                });
            } catch (error) {
                set({
                    loadingHistory: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch history",
                });
            }
        },

        fetchDashboardStatus: async (
            childId: string,
            token: string
        ) => {
            try {
                set({
                    loadingDashboard: true,
                    error: null,
                });

                const data = await dashboardStatus(
                    childId,
                    token
                );

                set({
                    dashboard: data,
                    loadingDashboard: false,
                });
            } catch (error) {
                set({
                    loadingDashboard: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch dashboard status",
                });
            }
        },

        clearError: () => {
            set({ error: null });
        },

        reset: () => {
            set({
                recommendation: null,
                history: null,
                dashboard: null,

                loadingRecommendation: false,
                loadingHistory: false,
                loadingDashboard: false,

                error: null,
            });
        },
    }));