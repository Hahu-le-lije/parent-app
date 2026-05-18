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

  loadSubscriptions: (token: string) => Promise<void>;
  assignSubscription: (subscription_id: string, child_id: string, token: string) => Promise<void>;
  renewSubscription: (subscription_id: string, child_id: string, token: string) => Promise<void>;
  buySubscription: (count: number, plan: string, token: string) => Promise<string>;
};

export const useSubscriptionStore = create<SubscriptionStoretype>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,


  loadSubscriptions: async (token: string) => {
    set({ loading: true, error: null });

    try {
      const data = await getSubscriptions(token);

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
  buySubscription: async (count: number, plan: string,token:string) => {
    set({ loading: true, error: null });
    try {
      const checkoutUrl = await buySubscriptionService(count, plan,token);
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


  assignSubscription: async (subscription_id: string, child_id: string, token: string) => {
    set({ loading: true, error: null });

    try {
      await assignsubscription(child_id, subscription_id,token);
      await get().loadSubscriptions(token);
      set({ loading: false });
    } catch (e: any) {
      set({
        error: e.message || "Failed to assign subscription",
        loading: false,
      });
      throw e;
    }
  },

  renewSubscription: async (subscription_id: string, child_id: string, token: string) => {
    set({ loading: true, error: null });

    try {
      await renewsubscription(child_id, subscription_id, token);
      await get().loadSubscriptions(token);
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