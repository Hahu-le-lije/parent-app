
export const saveChoice= async (selectedSubjects:string[],childId:string)=>{
    console.log("selectedSubjects: ",selectedSubjects)
try{
    const res=await fetch('',{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            allowedSubjects:selectedSubjects 
        })
    })
if(!res.ok){
    throw new Error("Failed to save choice")
}
}catch(e){
    console.log("error in saving choice: ",e)
    throw e
}
}
export const getChoice=async(childId:string)=>{
    try{

    }catch(e){
        console.log("error in getting choice: ",e)
        throw e
    }
}