import { create } from "zustand";
import { Subscription } from "@/types/type";

import {
  getSubscriptions,
  assignsubscription,
  renewsubscription,
  buySubscription as buySubscriptionService,
} from "@/services/subscriptionService"; 

type SubscriptionStoretype = {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;

  loadSubscriptions: () => Promise<void>;
  assignSubscription: (subscription_id: string, child_id: string) => Promise<void>;
  renewSubscription: (subscription_id: string, child_id: string) => Promise<void>;
  buySubscription: (count: number, plan: string, duration: string) => Promise<string>;
};

export const useSubscriptionStore = create<SubscriptionStoretype>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,


  loadSubscriptions: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getSubscriptions();

      set({
        subscriptions: data || [],
        loading: false,
      });
    } catch (e: any) {
      set({
        error: e.message || "Failed to load subscriptions",
        loading: false,
      });
    }
  },
  buySubscription: async (count: number, plan: string, _duration: string) => {
    set({ loading: true, error: null });
    try {
      const checkoutUrl = await buySubscriptionService(count, plan);
      set({ loading: false });
      return checkoutUrl;
    } catch (e: any) {
      set({
        error: e.message || "Failed to buy subscription",
        loading: false,
      });
      throw e;
    }
  },


  assignSubscription: async (subscription_id, child_id) => {
    set({ loading: true, error: null });

    try {
      await assignsubscription(child_id, subscription_id);
      await get().loadSubscriptions();
      set({ loading: false });
    } catch (e: any) {
      set({
        error: e.message || "Failed to assign subscription",
        loading: false,
      });
      throw e;
    }
  },

  renewSubscription: async (subscription_id, child_id) => {
    set({ loading: true, error: null });

    try {
      await renewsubscription(child_id, subscription_id);
      await get().loadSubscriptions();
      set({ loading: false });
    } catch (e: any) {
      set({
        error: e.message || "Failed to renew subscription",
        loading: false,
      });
      throw e;
    }
  },
}));