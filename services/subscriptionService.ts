import { Subscription } from "@/types/type";
import { getToken } from "@clerk/clerk-expo";

const BASE_URL = "";   

export const getSubscriptions = async ():Promise<Subscription[]> => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch subscriptions");
  return res.json();
};

export const buySubscription = async (count: number, plan: string, duration: string) => {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}`, {   
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      max_slots: Number(count),
      plan_type: plan,
      duration: duration,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to purchase subscription");
  }

  return res.json();   
};

export const assignsubscription = async (childId: string, subscriptionId: string) => {
  const token = await getToken();

  const res = await fetch(``, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ childId, subscriptionId }),
  });

  if (!res.ok) throw new Error("Failed to assign subscription");
  return res.json();
};

export const renewsubscription = async (childId: string, subscriptionId: string) => {
  const token = await getToken();

  const res = await fetch(``, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ childId, subscriptionId }),
  });

  if (!res.ok) throw new Error("Failed to renew subscription");
  return res.json();
};