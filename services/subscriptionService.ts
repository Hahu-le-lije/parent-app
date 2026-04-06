import { getToken } from "@clerk/clerk-expo";
export const getSubscriptions=async()=>{
    const token=await getToken();
    try{
        const res=await fetch("",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            }
        })
        if(!res.ok){
            throw new Error("Failed to get subscriptions")
        }
        return res.json()
    }
    catch(e){
        console.error("Error getting subscriptions: ", e)
        throw e
    }

}
export const buySubscription=async(count:number,plan:string)=>{
    const token=await getToken();
    try{
        const res=await fetch("",{

        })
    }catch(e){
        console.error("Error buying subscription: ", e)
        throw e
    }

}
export const assignsubscription=async(childId:string,subscriptionId:string)=>{
    try{
        const res=await fetch("",{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                childId,
                subscriptionId
            })
        })
        if(!res.ok){
            throw new Error("Failed to assign subscription")
        }

    }catch(e){
        console.error("Error assigning subscription: ", e)
        throw e
    }

}
export const renewsubscription=async(childId:string,subscriptionId:string)=>{
    try{
        const res=await fetch("",{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                childId,
                subscriptionId
            })
        })
        if(!res.ok){
            throw new Error("Failed to renew subscription")
        }
    }catch(e){
        console.error("Error renewing subscription: ", e)
        throw e
    }
}