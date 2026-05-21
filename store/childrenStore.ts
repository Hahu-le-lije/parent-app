import { create } from "zustand";
import { Child,NewChild } from "@/types/type";
import {
  getChildren,
  addChild as addChildAPI,
  updateChild as updateChildAPI,
  deleteChild as deleteChildAPI,
} from "@/services/childService"

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

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
        error: errorMessage(e, "Failed to load children"),
        loading: false,
      });
    }
  },


  addChild: async (payload:NewChild, token: string) => {
    set({ loading: true, error: null });

    try {
      const created = await addChildAPI(payload, token);

      set((state) => ({
        children: [...state.children, created.child],
        loading: false,
      }));
    } catch (e) {
      const message = errorMessage(e, "Failed to add child");
      set({
        error: message,
        loading: false,
      });
      throw new Error(message);
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
      const message = errorMessage(e, "Failed to update child");
      set({
        error: message,
        loading: false,
      });
      throw new Error(message);
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
      const message = errorMessage(e, "Failed to delete child");
      set({
        error: message,
        loading: false,
      });
      throw new Error(message);
    }
  },
}));
