import { create } from "zustand";
import { Child,NewChild } from "@/types/type";
import {
  getChildren,
  addChild as addChildAPI,
  updateChild as updateChildAPI,
  deleteChild as deleteChildAPI,
} from "@/services/childService"


type ChildrenState = {
  children: Child[];
  loading: boolean;
  error: string | null;

  loadChildren: () => Promise<void>;
  addChild: (payload: NewChild) => Promise<void>;
  updateChild: (id: string, patch: Partial<Child>) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
};

export const useChildrenStore = create<ChildrenState>((set, get) => ({
  children: [],
  loading: false,
  error: null,

  loadChildren: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getChildren();
      set({ children: data, loading: false });
    } catch (e) {
      set({
        error: "Failed to load children",
        loading: false,
      });
    }
  },


  addChild: async (payload:NewChild) => {
    set({ loading: true, error: null });

    try {
      await addChildAPI(payload);

      await get().loadChildren();

    } catch (e) {
      set({
        error: "Failed to add child",
        loading: false,
      });
    }
  },


  updateChild: async (id, patch) => {
    set({ loading: true, error: null });

    try {
      await updateChildAPI(id, patch as any );

      set((state) => ({
        children: state.children.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
        loading: false,
      }));
    } catch (e) {
      set({
        error: "Failed to update child",
        loading: false,
      });
    }
  },

  
  deleteChild: async (id) => {
    set({ loading: true, error: null });

    try {
      await deleteChildAPI(id);

      set((state) => ({
        children: state.children.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (e) {
      set({
        error: "Failed to delete child",
        loading: false,
      });
    }
  },
}));