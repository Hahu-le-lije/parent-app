import { create } from "zustand";
import { Subject,Subjects } from "@/types/type";
import { getSubjects, updateSubjects } from "@/services/subjectService";

type SubjectState={
    subjects:Subject[]|null;
    loading:boolean;
    error:string|null;

    loadSubjects:(child_id:string)=>Promise<void>;
    updateSubjects:(child_id:string,subjects:Subjects)=>Promise<void>;
}
export const useSubjectStore=create<SubjectState>((set)=>({
    subjects:null,
    loading:false,
    error:null,
    loadSubjects:async(child_id)=>{
        set({loading:true});
        try{
            const data=await getSubjects(child_id);
            set({subjects:data,error:null});
        }catch(error){
            set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load child subjects",
      });
        }
    finally {
      set({ loading: false });
    }
    },
    updateSubjects:async(child_id,subjects)=>{
        set({loading:true});
        try{
            await updateSubjects(child_id,subjects);
            
            const data=await getSubjects(child_id);
            set({subjects:data,error:null});
        }catch(error){
            set({
                error: error instanceof Error ? 
                error.message : 
                "Failed to update child subjects",
            })
        }
        finally{
            set({loading:false});
        }
    }
}))