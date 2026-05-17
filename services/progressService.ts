// import { Analytics, DailyProgress, WeeklyProgress } from "@/types/type";

// const Base_URL = process.env.EXPO_PUBLIC_API;
// export const getDailyProgress = async (
//   token: string,
//   childId: string,
// ): Promise<DailyProgress> => {
//   try {
//     const res = await fetch(
//       `${Base_URL}/api/children/${childId}/daily-summary`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData?.message || "Failed to fetch daily progress");
//     }

//     return await res.json();
//   } catch (err: any) {
//     console.log(err);
//     throw new Error(
//       err?.message || "An error occurred while fetching daily progress",
//     );
//   }
// };

// export const getWeeklyProgress = async (
//   token: string,
//   childId: string,
// ): Promise<WeeklyProgress> => {
//   try {
//     const res = await fetch(
//       `${Base_URL}/api/children/${childId}/weekly-summary`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData?.message || "Failed to fetch weekly progress");
//     }

//     return await res.json();
//   } catch (err: any) {
//     console.log(err);
//     throw new Error(
//       err?.message || "An error occurred while fetching weekly progress",
//     );
//   }
// };

// export const getAnalytics= async (
//     token:string,
//     childId:string,
// ):Promise<Analytics>=>{
//     try {
//     const res = await fetch(
//       `${Base_URL}/api/children/${childId}/analytics-overview`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData?.message || "Failed to fetch analytics overview");
//     }

//     return await res.json();
//   } catch (err: any) {
//     console.log(err);
//     throw new Error(
//       err?.message || "An error occurred while fetching analytics overview",
//     );
//   }

// }
import { Analytics, DailyProgress, WeeklyProgress } from "@/types/type";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDailyProgress = async (
  token: string,
  childId: string
): Promise<DailyProgress> => {
  await delay(800);
  return {
    data: {
      child_id: childId,
      summary_date: new Date(),
      total_sessions: 4,
      total_questions: 25,
      correct_answers: 20,
      accuracy: 0.8,
      time_spent: 1200, // 20 mins
      consistency: 0.9,
      skill_diversity: 0.7,
      mastery_score: 82,
      generated_explanation: "Great job today! They showed high accuracy in Ethiopic vowel recognition.",
      algorithm_version: 1,
    },
  };
};

export const getWeeklyProgress = async (
  token: string,
  childId: string
): Promise<WeeklyProgress> => {
  await delay(1000);
  return {
    data: {
      child_id: childId,
      week_start_date: new Date(Date.now() - 604800000),
      week_end_date: new Date(),
      total_sessions: 15,
      total_questions: 150,
      correct_answers: 125,
      accuracy: 0.83,
      time_spent: 18000, // 5 hours
      consistency: 0.85,
      skill_diversity: 0.65,
      mastery_score: 85,
      generated_explanation: "A very productive week. Focus on tracing 'Sadi' characters next week to balance skill diversity.",
      algorithm_version: 1,
    },
  };
};

export const getAnalytics = async (
  token: string,
  childId: string
): Promise<Analytics> => {
  await delay(1200);
  return {
    daily_summary: {
      child_id: childId,
      summary_date: new Date(),
      total_sessions: 3,
      total_questions: 30,
      correct_answers: 24,
      accuracy: 0.8,
      time_spent: 1500,
      consistency: 1.0,
      skill_diversity: 0.5,
      mastery_score: 78,
      generated_explanation: "Daily goal met! Keep up the consistent pace.",
      algorithm_version: 1,
    },
    weekly_summary: {
      child_id: childId,
      week_start_date: new Date(Date.now() - 604800000),
      week_end_date: new Date(),
      total_sessions: 12,
      total_questions: 200,
      correct_answers: 170,
      accuracy: 0.85,
      time_spent: 16200,
      consistency: 0.8,
      skill_diversity: 0.75,
      mastery_score: 88,
      generated_explanation: "Weekly mastery is trending upward. Excellent work on complex character recognition.",
      algorithm_version: 1,
    },
  };
};