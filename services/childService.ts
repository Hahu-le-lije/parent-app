import { Child } from "@/types/type";
import { getToken } from "@clerk/clerk-expo";

const API = "http://localhost:8000/children";

interface NewChild {
  firstName: string;
  lastName: string;
  dob: Date;
  avatar?: string;
}
interface Popup{
  username: string
  password: string
}

export const getChildren = async (): Promise<Child[]> => {
  try {
    const token = await getToken();

    const res = await fetch(API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch children");
    }

    return await res.json();
  } catch (e) {
    console.error("Error fetching children:", e);
    throw e;
  }
};

export const addChild = async (child: NewChild): Promise<Popup> => {
  try {
    const token = await getToken();

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...child,
        dob: child.dob.toISOString(), 
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to add child");
    }

    return await res.json();
  } catch (e) {
    console.error("Error adding child:", e);
    throw e;
  }
};
export const updateChild=async(id:string,child:NewChild):Promise<void>=>{
    try{
        const token=await getToken();
        const res=await fetch(`${API}/${id}`,{
            method:"PUT",
            headers:{
                "content-type":"application/json",
                Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({
                ...child,
                dob:child.dob.toISOString()
            })
        })
        if(!res.ok){
            throw new Error("Failed to update child")
        }

    }catch(e){
        console.error("Error adding Child: ", e)
        throw e
    }
}
export const deleteChild=async(id:string):Promise<void>=>{
    try{
        const token=await getToken();
        const res=await fetch(`${API}/${id}`,{
            method:"DELETE",
            headers:{
                "content-type":"application/json",
                Authorization:`Bearer ${token}`
            }
        })
    if(!res.ok){
        throw new Error("Failed to delete child")
    }

    }catch(e){
        console.error("Error adding Child: ", e)
        throw e
    }
}