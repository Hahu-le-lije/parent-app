// import { Subject,Subjects } from "@/types/type";
// const API = process.env.EXPO_PUBLIC_API;
// export const getSubjects=async(child_id:string):Promise<Subject[]>=>{
//     try{
//         const res=await fetch(`${API},{
//             method:"GET",
//             headers:{
//                 "Content-Type":"application/json"
//             },
//             body:JSON.stringify({child_id})
//         })
//         const data=await res.json();
//         return data;
//     }catch(error){
//         throw new Error(
//             error instanceof Error
//               ? error.message
//               : "Failed to fetch child subjects"
//           );
//     }
// }
// export const updateSubjects=async(child_id:string,subjects:Subjects):Promise<void>=>{
//     try{
//         await fetch(`${API}`,{
//             method:"PUT",
//             headers:{
//                 "Content-Type":"application/json"
//             },
//             body:JSON.stringify({child_id,subjects})
//         })


//     }catch(error){
//         throw new Error(
//             error instanceof Error
//               ? error.message
//               : "Failed to update child subjects"
//           );
//     }
// }
import { Subject, Subjects } from "@/types/type";

// 1. Initial Mock Data (Your "In-Memory Database")
let mockDatabase: Subject[] = [
  { game_type_id: 1, game_type_name: "Fidel Tracing", status: true },
  { game_type_id: 2, game_type_name: "Word Builder", status: false },
  { game_type_id: 3, game_type_name: "Pronunciation Game", status: true },
  { game_type_id: 4, game_type_name: "Number Counting", status: false },
  { game_type_id: 5, game_type_name: "Color Matching", status: true },
];

// Helper to simulate network latency
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * MOCK GET SUBJECTS
 * Simulates fetching allowed games for a specific child
 */
export const getSubjects = async (child_id: string): Promise<Subject[]> => {
  console.log(`[Mock API] Fetching subjects for child: ${child_id}`);
  
  await delay(800); // Simulate network lag
  
  // In a real app, you'd filter by child_id, but for testing 
  // we'll just return the current state of our mock database.
  return [...mockDatabase]; 
};

/**
 * MOCK UPDATE SUBJECTS
 * Simulates saving changes back to the database
 */
export const updateSubjects = async (
  child_id: string, 
  subjectsData: Subjects
): Promise<void> => {
  console.log(`[Mock API] Updating subjects for child: ${child_id}`, subjectsData);

  await delay(1200); // Simulate a slightly longer save time

  // Simulate a random failure (Optional: uncomment to test error handling)
  /*
  if (Math.random() > 0.8) {
    throw new Error("Simulated Server Error: Could not reach database.");
  }
  */

  // Update our local "database" with the new data
  mockDatabase = subjectsData.subjects;
  
  return;
};