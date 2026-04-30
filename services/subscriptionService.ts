import { Subscription } from "@/types/type";
import { getToken } from "@clerk/clerk-expo";

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "");

type ApiResponse<T> = {
  status?: "success" | "failed";
  data?: T;
  message?: string;
  error?: string;
};

type InitializePaymentData = { checkout_url: string };
type SubscriptionListData = { subscriptions: Subscription[] };
type SubscriptionDetailsData = { subscription: Subscription };
type CreateSubscriptionPayload = {
  trx_ref: string;
  ref_id: string;
  status: string;
};
type CreateSubscriptionData = { subscription: Subscription };

const buildUrl = (path: string) => `${BASE_URL}${path}`;

const authHeaders = async () => {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const parseResponse = async <T>(res: Response): Promise<ApiResponse<T>> => {
  return res.json().catch(() => ({} as ApiResponse<T>));
};

export const getSubscriptions = async (): Promise<Subscription[]> => {
  const res = await fetch(buildUrl("/subscriptions/list"), {
    method: "GET",
    headers: await authHeaders(),
  });

  const payload = await parseResponse<SubscriptionListData>(res);

  if (!res.ok || payload.status === "failed") {
    throw new Error(payload.error || payload.message || "Failed to fetch subscriptions");
  }

  return payload.data?.subscriptions ?? [];
};

export const buySubscription = async (count: number, plan: string) => {
  const res = await fetch(buildUrl("/initialize-payment"), {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({
      max_slots: Number(count),
      plan_type: plan,
    }),
  });

  const payload = await parseResponse<InitializePaymentData>(res);
  const checkoutUrl = payload.data?.checkout_url;

  
  if (!res.ok || payload.status === "failed" || !checkoutUrl) {
    throw new Error(payload.error || payload.message || "invalid checkout url");
  }

  return checkoutUrl;
};

export const getSubscriptionDetails = async (
  subscriptionId: string | number
): Promise<Subscription> => {
  const id = String(subscriptionId);
  if (!/^\d+$/.test(id)) {
    throw new Error("Subscription id must be numeric");
  }

  const res = await fetch(buildUrl(`/subscriptions/${id}`), {
    method: "GET",
    headers: await authHeaders(),
  });

  const payload = await parseResponse<SubscriptionDetailsData>(res);
  if (!res.ok || payload.status === "failed" || !payload.data?.subscription) {
    throw new Error(payload.error || payload.message || "Failed to fetch subscription details");
  }

  return payload.data.subscription;
};

export const assignsubscription = async (childId: string, subscriptionId: string ) => {
  

  const res = await fetch(buildUrl(`/subscriptions/add-child/${subscriptionId}/${childId}`), {
    method: "PUT",
    headers: await authHeaders(),
  });

  const payload = await parseResponse<unknown>(res);
  if (!res.ok || payload.status === "failed") {
    throw new Error(payload.error || payload.message || "Failed to assign subscription");
  }

  return payload;
};

export const renewsubscription = async (childId: string, subscriptionId: string) => {
  return assignsubscription(childId, subscriptionId);
};

export const createSubscription = async (payloadBody: CreateSubscriptionPayload) => {
  const res = await fetch(buildUrl("/subscriptions/create"), {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payloadBody),
  });

  const payload = await parseResponse<CreateSubscriptionData>(res);
  if (!res.ok || payload.status === "failed") {
    throw new Error(payload.error || payload.message || "Failed to create subscription");
  }

  return payload.data?.subscription;
};