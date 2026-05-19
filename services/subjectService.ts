import { Subject,Subjects } from "@/types/type";
const API = process.env.EXPO_PUBLIC_API_CHILD;
export const getSubjects=async(child_id:string):Promise<Subject[]>=>{
    try{
        const res=await fetch(`${API}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({child_id})
        })
        const data=await res.json();
        return data;
    }catch(error){
        throw new Error(
            error instanceof Error
              ? error.message
              : "Failed to fetch child subjects"
          );
    }
}
export const updateSubjects=async(child_id:string,subjects:Subjects):Promise<void>=>{
    try{
        await fetch(`${API}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({child_id,subjects})
        })


    }catch(error){
        throw new Error(
            error instanceof Error
              ? error.message
              : "Failed to update child subjects"
          );
    }
}
