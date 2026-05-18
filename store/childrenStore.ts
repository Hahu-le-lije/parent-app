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

  loadChildren: (token:string) => Promise<void>;
  addChild: (payload: NewChild, token: string) => Promise<void>;
  updateChild: (id: string, patch: Partial<Child>, token: string) => Promise<void>;
  deleteChild: (id: string, token: string) => Promise<void>;
};

export const useChildrenStore = create<ChildrenState>((set, get) => ({
  children: [],
  loading: false,
  error: null,

  loadChildren: async (token:string) => {
    set({ loading: true, error: null });
    try {
      const data = await getChildren(token);
      set({ children: data, loading: false });
    } catch (e) {
      set({
        error: "Failed to load children",
        loading: false,
      });
    }
  },


  addChild: async (payload:NewChild, token: string) => {
    set({ loading: true, error: null });

    try {
      await addChildAPI(payload, token);

      await get().loadChildren(token);

    } catch (e) {
      set({
        error: "Failed to add child",
        loading: false,
      });
    }
  },


  updateChild: async (id, patch, token) => {
    set({ loading: true, error: null });

    try {
      await updateChildAPI(id, patch as any, token);

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

  
  deleteChild: async (id, token) => {
    set({ loading: true, error: null });

    try {
      await deleteChildAPI(id, token);

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