import { Subject,Subjects } from "@/types/type";
export const getSubjects=async(child_id:string):Promise<Subject[]>=>{
    try{
        const res=await fetch('',{
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
        await fetch('',{
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