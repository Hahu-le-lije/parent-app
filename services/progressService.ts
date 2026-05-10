import { Analytics, DailyProgress, WeeklyProgress } from "@/types/type";

const Base_URL = process.env.REACT_APP_BASE_URL;
export const getDailyProgress = async (
  token: string,
  childId: string,
): Promise<DailyProgress> => {
  try {
    const res = await fetch(
      `${Base_URL}/api/children/${childId}/daily-summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || "Failed to fetch daily progress");
    }

    return await res.json();
  } catch (err: any) {
    console.log(err);
    throw new Error(
      err?.message || "An error occurred while fetching daily progress",
    );
  }
};

export const getWeeklyProgress = async (
  token: string,
  childId: string,
): Promise<WeeklyProgress> => {
  try {
    const res = await fetch(
      `${Base_URL}/api/children/${childId}/weekly-summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || "Failed to fetch weekly progress");
    }

    return await res.json();
  } catch (err: any) {
    console.log(err);
    throw new Error(
      err?.message || "An error occurred while fetching weekly progress",
    );
  }
};

export const getAnalytics= async (
    token:string,
    childId:string,
):Promise<Analytics>=>{
    try {
    const res = await fetch(
      `${Base_URL}/api/children/${childId}/analytics-overview`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || "Failed to fetch analytics overview");
    }

    return await res.json();
  } catch (err: any) {
    console.log(err);
    throw new Error(
      err?.message || "An error occurred while fetching analytics overview",
    );
  }

}
