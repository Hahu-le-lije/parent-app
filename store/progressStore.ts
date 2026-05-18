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
  progressChildId: string | null;
  loading: boolean;
  error: string | null;

  loadAllProgress: (token: string, childId: string) => Promise<void>;
  reset: () => void;
};

export const useProgressStore = create<ProgressState>((set) => ({
  dailyProgress: null,
  weeklyProgress: null,
  analytics: null,
  progressChildId: null,
  loading: false,
  error: null,

  loadAllProgress: async (token: string, childId: string) => {
    if (!token || !childId) {
      return;
    }
    set({
      loading: true,
      error: null,
      progressChildId: childId,
      dailyProgress: null,
      weeklyProgress: null,
      analytics: null,
    });
    try {
      const [daily, weekly, analytics] = await Promise.all([
        getDailyProgress(token, childId),
        getWeeklyProgress(token, childId),
        getAnalytics(token, childId),
      ]);
      set({
        dailyProgress: daily,
        weeklyProgress: weekly,
        analytics,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load learning progress",
      });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => {
    set({
      dailyProgress: null,
      weeklyProgress: null,
      analytics: null,
      progressChildId: null,
      loading: false,
      error: null,
    });
  },
}));
