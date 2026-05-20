import { Subscription } from "@/types/type";


const BASE_URL = (process.env.EXPO_PUBLIC_API_SUB ?? "").replace(/\/$/, "");

type ApiResponse<T> = {
  status?: string;
  data?: T;
  message?: string;
  error?: string;
  checkout_url?: string;
  checkoutUrl?: string;
  payment_url?: string;
  paymentUrl?: string;
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

const buildUrl = (path: string) => `${BASE_URL}/api${path}`;

const authHeaders = async (token:string) => {


  if (!token) {

    throw new Error("Not authenticated (missing session token)");
  }

  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};

const parseResponse = async <T>(res: Response): Promise<ApiResponse<T>> => {
  return res.json().catch(() => ({} as ApiResponse<T>));
};

const firstString = (...values: unknown[]) =>
  values.find((value): value is string => typeof value === "string" && value.trim().length > 0);

const getCheckoutUrl = (payload: ApiResponse<InitializePaymentData>) => {
  const data = payload.data as InitializePaymentData &
    Partial<ApiResponse<unknown>> & {
      checkoutUrl?: string;
      payment_url?: string;
      paymentUrl?: string;
      url?: string;
    };

  return firstString(
    data?.checkout_url,
    data?.checkoutUrl,
    data?.payment_url,
    data?.paymentUrl,
    data?.url,
    payload.checkout_url,
    payload.checkoutUrl,
    payload.payment_url,
    payload.paymentUrl
  );
};

export const getSubscriptions = async (token:string): Promise<Subscription[]> => {
  const res = await fetch(buildUrl("/subscriptions/list"), {
    method: "GET",
    headers: await authHeaders(token),
  });

  const payload = await parseResponse<SubscriptionListData>(res);
  console.log("get subscription: ",payload)

  if (!res.ok || payload.status === "failed") {
    throw new Error(payload.error || payload.message || "Failed to fetch subscriptions");
  }

  return payload.data?.subscriptions ?? [];
};

export const buySubscription = async (count: number, plan: string, token: string) => {
  const body = {
    max_slots: Number(count),
    plan_type: plan,
  };

  const res = await fetch(buildUrl("/initialize-payment"), {
    method: "POST",
    headers: await authHeaders(token),
    body: JSON.stringify(body),
  });

  const payload = await parseResponse<InitializePaymentData>(res);
  const checkoutUrl = getCheckoutUrl(payload);

  console.log("Buy subscription response:", {
    status: res.status,
    checkoutUrl,
    payload,
    requestBody: body,
  });
  if (!res.ok || payload.status === "failed" || !checkoutUrl) {
    throw new Error(payload.error || payload.message || `Invalid checkout url (HTTP ${res.status})`);
  }

  return checkoutUrl;
};

export const getSubscriptionDetails = async (
  subscriptionId: string | number,
  token: string
): Promise<Subscription> => {
  const id = String(subscriptionId);
  if (!/^\d+$/.test(id)) {
    throw new Error("Subscription id must be numeric");
  }

  const res = await fetch(buildUrl(`/subscriptions/${id}`), {
    method: "GET",
    headers: await authHeaders(token),
  });

  const payload = await parseResponse<SubscriptionDetailsData>(res);
  if (!res.ok || payload.status === "failed" || !payload.data?.subscription) {
    throw new Error(payload.error || payload.message || "Failed to fetch subscription details");
  }
  console.log("Subscription details response:", payload,token);
  return payload.data.subscription;
};

export const assignsubscription = async (childId: string, subscriptionId: string, token: string) => {
  

  const res = await fetch(buildUrl(`/subscriptions/add-child/${subscriptionId}/${childId}`), {
    method: "PUT",
    headers: await authHeaders(token),
  });

  const payload = await parseResponse<unknown>(res);
  if (!res.ok || payload.status === "failed") {
    throw new Error(payload.error || payload.message || "Failed to assign subscription");
  }

  return payload;
};

export const renewsubscription = async (childId: string, subscriptionId: string, token: string) => {
  return assignsubscription(childId, subscriptionId, token);
};

export const createSubscription = async (payloadBody: CreateSubscriptionPayload, token?: string) => {
  const res = await fetch(buildUrl("/subscriptions/create"), {
    method: "POST",
    headers: token ? await authHeaders(token) : { "Content-Type": "application/json" },
    body: JSON.stringify(payloadBody),
  });

  const payload = await parseResponse<CreateSubscriptionData>(res);
  if (!res.ok || payload.status === "failed") {
    throw new Error(payload.error || payload.message || "Failed to create subscription");
  }

  return payload.data?.subscription;
};
