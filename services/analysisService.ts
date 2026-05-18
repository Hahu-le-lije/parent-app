import { DashboardStatus, Recommendation, RecommendationHistoryResponse } from "@/types/type";

const API=process.env.EXPO_PUBLIC_API;
export const getRecommendations=async(child_id:string,token:string):Promise<Recommendation>=>{
    try{
        const res=await fetch(`${API}parents/children/${child_id}/recommendation`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        const data=await res.json();
        if(!res.ok){
            throw new Error(data.message || "Failed to fetch recommendations from ai");
        }
        return data as Recommendation;

    }catch(error){
        throw new Error(
            error instanceof Error
              ? error.message
              : "Failed to fetch recommendations from ai"
          );
    }
}
export const dashboardStatus=async(child_id:string,token:string):Promise<DashboardStatus>=>{
    try{
        const res=await fetch(`${API}parents/children/${child_id}/dashboard-status`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        const data=await res.json();
        if(!res.ok){
            throw new Error(data.message || "Failed to fetch dashboard status");
        }
        return data as DashboardStatus;

    }catch(error){
        throw new Error(
            error instanceof Error
              ? error.message
              : "Failed to fetch dashboard status"
          );
    }
}
export const recommendationHistory=async(child_id:string,token:string):Promise<RecommendationHistoryResponse>=>{
    try{
        const res=await fetch(`${API}parents/children/${child_id}/recommendation/history`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }        })
        const data=await res.json();
        if(!res.ok){
            throw new Error(data.message || "Failed to fetch recommendation history");
        }
        return data as RecommendationHistoryResponse;
    }catch(error){
        throw new Error(
            error instanceof Error
              ? error.message
              : "Failed to fetch recommendation history"
          );
    }
}