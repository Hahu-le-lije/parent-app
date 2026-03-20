import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

export type AppLanguage = "en" | "am";

type LanguageState = {
  language: AppLanguage;
  hydrated: boolean;
  hydrateLanguage: () => Promise<void>;
  setLanguage: (lang: AppLanguage) => Promise<void>;
};

const STORAGE_KEY = "app_language";

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: "en",
  hydrated: false,

  hydrateLanguage: async () => {
    if (get().hydrated) return;
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (stored === "en" || stored === "am") {
        set({ language: stored });
      }
    } catch {
      // If persistence fails, we safely fall back to English.
    } finally {
      set({ hydrated: true });
    }
  },

  setLanguage: async (lang) => {
    set({ language: lang });
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, lang);
    } catch {
      // Ignore persistence errors; UI state is still updated.
    }
  },
}));

