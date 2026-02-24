import { create } from 'zustand';

export type Child = {
  _id: string;
  id: number;
  name: string;
  age: number;
  subscription: string;
  paid: boolean;
  image: string;
};

type PurchasedPlan = {
  id: string;
  name: string;
};

type ChildrenState = {
  children: Child[];
  loading: boolean;
  error: string | null;
  lastPurchasedPlan: PurchasedPlan | null;
  loadChildren: () => Promise<void>;
  addChild: (payload: Omit<Child, '_id' | 'id'>) => void;
  updateChild: (id: string, patch: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  setLastPurchasedPlan: (plan: PurchasedPlan | null) => void;
  assignLastPurchasedToChild: (childId: string) => void;
};

const placeholderChildren: Child[] = [
  {
    _id: '1',
    id: 1,
    name: 'John Doe',
    age: 10,
    subscription: 'Premium',
    paid: true,
    image: 'https://randomuser.me/api/portraits/lego/1.jpg',
  },
  {
    _id: '2',
    id: 2,
    name: 'Sophia Smith',
    age: 8,
    subscription: 'Basic',
    paid: false,
    image: 'https://randomuser.me/api/portraits/lego/2.jpg',
  },
  {
    _id: '3',
    id: 3,
    name: 'Liam Johnson',
    age: 12,
    subscription: 'Premium',
    paid: true,
    image: 'https://randomuser.me/api/portraits/lego/3.jpg',
  },
  {
    _id: '4',
    id: 4,
    name: 'Emma Williams',
    age: 9,
    subscription: 'Standard',
    paid: true,
    image: 'https://randomuser.me/api/portraits/lego/4.jpg',
  },
  {
    _id: '5',
    id: 5,
    name: 'Noah Brown',
    age: 11,
    subscription: 'Premium',
    paid: false,
    image: 'https://randomuser.me/api/portraits/lego/5.jpg',
  },
];

export const useChildrenStore = create<ChildrenState>((set) => ({
  children: [],
  loading: false,
  error: null,
  lastPurchasedPlan: null,

  loadChildren: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate backend call; later replace with real API
      await new Promise((resolve) => setTimeout(resolve, 400));
      set({ children: placeholderChildren, loading: false });
    } catch (e) {
      set({
        error: 'Failed to load children. Please try again.',
        loading: false,
      });
    }
  },

  addChild: (payload) =>
    set((state) => {
      const nextNumericId =
        state.children.reduce((max, c) => Math.max(max, c.id), 0) + 1;

      const newChild: Child = {
        _id: String(Date.now()),
        id: nextNumericId || 1,
        ...payload,
      };

      return { children: [...state.children, newChild] };
    }),

  updateChild: (id, patch) =>
    set((state) => ({
      children: state.children.map((c) =>
        c._id === id ? { ...c, ...patch } : c
      ),
    })),

  deleteChild: (id) =>
    set((state) => ({
      children: state.children.filter((c) => c._id !== id),
    })),

  setLastPurchasedPlan: (plan) => set({ lastPurchasedPlan: plan }),

  assignLastPurchasedToChild: (childId) =>
    set((state) => {
      if (!state.lastPurchasedPlan) return state;

      const { lastPurchasedPlan } = state;

      return {
        children: state.children.map((c) =>
          c._id === childId
            ? {
                ...c,
                subscription: lastPurchasedPlan.name,
                paid: true,
              }
            : c
        ),
        lastPurchasedPlan: null,
      };
    }),
}));

