import {
    getAnalytics,
    getDailyProgress,
    getWeeklyProgress,
} from "@/services/progressService";
import { Analytics, DailyProgress, WeeklyProgress } from "@/types/type";
import { create } from "zustand";

type ProgressState = {
  dailyProgress: DailyProgress | null;
  weeklyProgress: WeeklyProgress | null;
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;

  loadDailyProgress: (childId: string, token: string) => Promise<void>;
  loadWeeklyProgress: (childId: string, token: string) => Promise<void>;
  loadAnalytics: (childId: string, token: string) => Promise<void>;
};
export const useProgressStore = create<ProgressState>((set) => ({
  dailyProgress: null,
  weeklyProgress: null,
  analytics: null,
  loading: false,
  error: null,
  loadDailyProgress: async (childId, token) => {
    set({ loading: true });
    try {
      const res = await getDailyProgress(childId, token);
      set({ dailyProgress: res, error: null });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load daily progress",
      });
    } finally {
      set({ loading: false });
    }
  },
  loadWeeklyProgress: async (childId, token) => {
    set({ loading: true });
    try {
      const data = await getWeeklyProgress(childId, token);
      set({ weeklyProgress: data, error: null });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load weekly progress",
      });
    } finally {
      set({ loading: false });
    }
  },
  loadAnalytics: async (childId, token) => {
    set({ loading: true });
    try {
      const data = await getAnalytics(childId, token);
      set({ analytics: data, error: null });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load analytics",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
