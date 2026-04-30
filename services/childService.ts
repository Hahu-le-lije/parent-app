import { Child } from "@/types/type";
// import { getToken } from "@clerk/clerk-expo";


// const API = process.env.API_URL;

// interface NewChild {
//   firstName: string;
//   lastName: string;
//   dob: Date;
//   avatar?: string;
// }
// interface Popup{
//   username: string
//   password: string
// }

// export const getChildren = async (): Promise<Child[]> => {
//   try {
//     const token = await getToken();

//     const res = await fetch(`${API}/children`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch children");
//     }

//     return await res.json();
//   } catch (e) {
//     console.error("Error fetching children:", e);
//     throw e;
//   }
// };
// export const getChildInfo=async(childId:string):Promise<Child>=>{
//   try{
//  const token=await getToken();
//  const res=await fetch(`${API}/children/${childId}`,{
//     method:"GET",
//     headers:{
//         "Content-type":"application/json",
//         Authorization:`Bearer ${token}`
//     },

//  })
//  if(!res.ok){
//     throw new Error("Failed to fetch child info")
//  }
//  return await res.json()
//   }catch(error){
//  console.error("Error fetching child info:", error);
//  throw error
//   }
// }
// export const addChild = async (child: NewChild): Promise<Popup> => {
//   try {
//     const token = await getToken();

//     const res = await fetch(`${API}/children`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         ...child,
//         dob: child.dob.toISOString(), 
//       }),
//     });

//     if (!res.ok) {
//       throw new Error("Failed to add child");
//     }

//     return await res.json();
//   } catch (e) {
//     console.error("Error adding child:", e);
//     throw e;
//   }
// };
// export const updateChild=async(id:string,child:NewChild):Promise<void>=>{
//     try{
//         const token=await getToken();
//         const res=await fetch(`${API}/children/${id}`,{
//             method:"PUT",
//             headers:{
//                 "Content-type":"application/json",
//                 Authorization:`Bearer ${token}`
//             },
//             body:JSON.stringify({
//                 ...child,
//                 dob:child.dob.toISOString()
//             })
//         })
//         if(!res.ok){
//             throw new Error("Failed to update child")
//         }

//     }catch(e){
//         console.error("Error adding Child: ", e)
//         throw e
//     }
// }
// export const deleteChild=async(id:string):Promise<void>=>{
//     try{
//         const token=await getToken();
//         const res=await fetch(`${API}/children/${id}`,{
//             method:"DELETE",
//             headers:{
//                 "Content-type":"application/json",
//                 Authorization:`Bearer ${token}`
//             }
//         })
//     if(!res.ok){
//         throw new Error("Failed to delete child")
//     }

//     }catch(e){
//         console.error("Error adding Child: ", e)
//         throw e
//     }
// }



// mock one will delete this gonna use the top one only 




const USE_MOCK = true;

interface NewChild {
  firstName: string;
  lastName: string;
  dob: Date;
  avatar?: string;
}

interface Popup {
  username: string;
  password: string;
}

let mockChildren: Child[] = [
   {
    id: "1",
    firstname: "John",
    lastname: "Doe",
    dob: new Date("2015-01-01"),
    subscription: "Premium",
    paid: true,
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    username: "john_doe",
    password: "pass123",
  },
  {
    id: "2",
    
    firstname: "Sophia",
    lastname: "Smith",
    dob: new Date("2017-03-15"),
    subscription: "Basic",
    paid: false,
    avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
    username: "sophia_smith",
    password: "pass123",
  },
  {
    id: "3",
    firstname: "Liam",
    lastname: "Johnson",
    dob: new Date("2013-07-20"),
    subscription: "Premium",
    paid: true,
    avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
    username: "liam_johnson",
    password: "pass123",
  },
  {
    id: "4",
    firstname: "Emma",
    lastname: "Williams",
    dob: new Date("2016-11-10"),
    subscription: "Standard",
    paid: true,
    avatar: "https://randomuser.me/api/portraits/lego/4.jpg",
    username: "emma_williams",
    password: "pass123",
  },
  {
    id: "5",
    firstname: "Noah",
    lastname: "Brown",
    dob: new Date("2014-05-05"),
    subscription: "Premium",
    paid: false,
    avatar: "https://randomuser.me/api/portraits/lego/5.jpg",
    username: "noah_brown",
    password: "pass123",
  },
];


const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));



export const getChildren = async (): Promise<Child[]> => {
  if (!USE_MOCK) throw new Error("Switch to real API");

  await delay();
  return mockChildren;
};



export const addChild = async (child: NewChild): Promise<Popup> => {
  if (!USE_MOCK) throw new Error("Switch to real API");

  await delay();

  const newChild: Child = {
    id: String(Date.now()),
    
    firstname: child.firstName,
    lastname: child.lastName,
    dob: child.dob,
    subscription: "Basic",
    paid: false,
    avatar:
      child.avatar ||
      "https://randomuser.me/api/portraits/lego/9.jpg",
    username: `${child.firstName.toLowerCase()}_${Date.now()}`,
    password: Math.random().toString(36).slice(-8),
  };

  mockChildren = [...mockChildren, newChild];

  return {
    username: newChild.username,
    password: newChild.password,
  };
};



export const updateChild = async (
  id: string,
  child: NewChild
): Promise<void> => {
  if (!USE_MOCK) throw new Error("Switch to real API");

  await delay();

  mockChildren = mockChildren.map((c) =>
    c.id === id
      ? {
          ...c,
          firstname: child.firstName,
          lastname: child.lastName,
          dob: child.dob,
          avatar: child.avatar || c.avatar,
        }
      : c
  );
};



export const deleteChild = async (id: string): Promise<void> => {
  if (!USE_MOCK) throw new Error("Switch to real API");

  await delay();

  mockChildren = mockChildren.filter((c) => c.id !== id);
};