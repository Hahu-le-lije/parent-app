import { Child } from "@/types/type";

const API = (process.env.EXPO_PUBLIC_API_CHILD ?? process.env.EXPO_PUBLIC_API ?? "").replace(/\/$/, "");

interface NewChild {
  firstName: string;
  lastName: string;
  dob: Date;
  avatar?: string;
}
interface Popup {
  child: Child;
  credentials: {
    username: string;
    pin: string;
  };
}

type ApiChild = {
  id: string | number;
  first_name?: string | null;
  last_name?: string | null;
  birthdate?: string | null;
  avatar?: string | null;
  username?: string | null;
  subscription_id?: string | null;
  status?: string | null;
};

const parseJson = async <T>(res: Response): Promise<T | null> => {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
};

const apiError = async (res: Response, fallback: string) => {
  const payload = await parseJson<{ message?: string; errors?: Record<string, string[]> }>(res);
  const validationMessage = payload?.errors
    ? Object.values(payload.errors).flat().join("\n")
    : undefined;
  const message = validationMessage || payload?.message || fallback;

  return new Error(`${message} (${res.status})`);
};

const mapChild = (child: ApiChild): Child => ({
  id: String(child.id),
  dob: child.birthdate ? new Date(child.birthdate) : new Date(),
  subscription: child.subscription_id ?? "No subscription",
  paid: Boolean(child.subscription_id),
  avatar: child.avatar ?? "",
  username: child.username ?? "",
  password: "",
  firstname: child.first_name ?? "",
  lastname: child.last_name ?? "",
});

const childPayload = (child: NewChild) => ({
  first_name: child.firstName,
  last_name: child.lastName,
  birthdate: child.dob.toISOString(),
  avatar: child.avatar ?? null,
});

export const getChildren = async (token:string): Promise<Child[]> => {
  try {
    if (!API) {
      throw new Error("Child service API URL is not configured.");
    }

    const res = await fetch(`${API}/api/parents/children`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw await apiError(res, "Could not load children from the child service.");
    }

    const data = (await res.json()) as ApiChild[];
    return data.map(mapChild);
  } catch (e) {
    console.error("Error fetching children:", e);
    throw e;
  }
};
export const getChildInfo = async (childId: string, token: string): Promise<Child> => {
  try {
    if (!API) {
      throw new Error("Child service API URL is not configured.");
    }
    
    
    const res = await fetch(`${API}/api/parents/children/${childId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw await apiError(res, "Could not load this child profile.");
    }
    const data = (await res.json()) as ApiChild;
    return mapChild(data);
  } catch (error) {
    console.error("Error fetching child info:", error);
    throw error;
  }
};
export const addChild = async (child: NewChild, token: string): Promise<Popup> => {
  try {
    if (!API) {
      throw new Error("Child service API URL is not configured.");
    }

    const res = await fetch(`${API}/api/parents/children`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(childPayload(child)),
    });

    if (!res.ok) {
      throw await apiError(res, "Could not add child.");
    }
    const data = (await res.json()) as { child: ApiChild; credentials: { username: string; pin: string } };
    console.log("Add child response:", data);
    return {
      child: {
        ...mapChild(data.child),
        password: data.credentials.pin,
      },
      credentials: data.credentials,
    };
  } catch (e) {
    console.error("Error adding child:", e);
    throw e;
  }
};
export const updateChild = async (
  id: string,
  child: NewChild,
  token:string
): Promise<void> => {
  try {
    if (!API) {
      throw new Error("Child service API URL is not configured.");
    }

    const res = await fetch(`${API}/api/parents/children/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(childPayload(child)),
    });
    if (!res.ok) {
      throw await apiError(res, "Could not update child.");
    }
  } catch (e) {
    console.error("Error adding Child: ", e);
    throw e;
  }
};
export const deleteChild = async (id: string,token:string): Promise<void> => {
  try {
    if (!API) {
      throw new Error("Child service API URL is not configured.");
    }
    
    
    const res = await fetch(`${API}/api/parents/children/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw await apiError(res, "Could not delete child.");
    }
  } catch (e) {
    console.error("Error adding Child: ", e);
    throw e;
  }
};



// mock one will delete this gonna use the top one only

// const USE_MOCK = true;

// interface NewChild {
//   firstName: string;
//   lastName: string;
//   dob: Date;
//   avatar?: string;
// }

// interface Popup {
//   username: string;
//   password: string;
// }

// let mockChildren: Child[] = [
//    {
//     id: "1",
//     firstname: "John",
//     lastname: "Doe",
//     dob: new Date("2015-01-01"),
//     subscription: "Premium",
//     paid: true,
//     avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
//     username: "john_doe",
//     password: "pass123",
//   },
//   {
//     id: "2",

//     firstname: "Sophia",
//     lastname: "Smith",
//     dob: new Date("2017-03-15"),
//     subscription: "Basic",
//     paid: false,
//     avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
//     username: "sophia_smith",
//     password: "pass123",
//   },
//   {
//     id: "3",
//     firstname: "Liam",
//     lastname: "Johnson",
//     dob: new Date("2013-07-20"),
//     subscription: "Premium",
//     paid: true,
//     avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
//     username: "liam_johnson",
//     password: "pass123",
//   },
//   {
//     id: "4",
//     firstname: "Emma",
//     lastname: "Williams",
//     dob: new Date("2016-11-10"),
//     subscription: "Standard",
//     paid: true,
//     avatar: "https://randomuser.me/api/portraits/lego/4.jpg",
//     username: "emma_williams",
//     password: "pass123",
//   },
//   {
//     id: "5",
//     firstname: "Noah",
//     lastname: "Brown",
//     dob: new Date("2014-05-05"),
//     subscription: "Premium",
//     paid: false,
//     avatar: "https://randomuser.me/api/portraits/lego/5.jpg",
//     username: "noah_brown",
//     password: "pass123",
//   },
// ];

// const delay = (ms = 400) =>
//   new Promise((resolve) => setTimeout(resolve, ms));

// export const getChildren = async (): Promise<Child[]> => {
//   if (!USE_MOCK) throw new Error("Switch to real API");

//   await delay();
//   return mockChildren;
// };

// export const addChild = async (child: NewChild): Promise<Popup> => {
//   if (!USE_MOCK) throw new Error("Switch to real API");

//   await delay();

//   const newChild: Child = {
//     id: String(Date.now()),

//     firstname: child.firstName,
//     lastname: child.lastName,
//     dob: child.dob,
//     subscription: "Basic",
//     paid: false,
//     avatar:
//       child.avatar ||
//       "https://randomuser.me/api/portraits/lego/9.jpg",
//     username: `${child.firstName.toLowerCase()}_${Date.now()}`,
//     password: Math.random().toString(36).slice(-8),
//   };

//   mockChildren = [...mockChildren, newChild];

//   return {
//     username: newChild.username,
//     password: newChild.password,
//   };
// };

// export const updateChild = async (
//   id: string,
//   child: NewChild
// ): Promise<void> => {
//   if (!USE_MOCK) throw new Error("Switch to real API");

//   await delay();

//   mockChildren = mockChildren.map((c) =>
//     c.id === id
//       ? {
//           ...c,
//           firstname: child.firstName,
//           lastname: child.lastName,
//           dob: child.dob,
//           avatar: child.avatar || c.avatar,
//         }
//       : c
//   );
// };

// export const deleteChild = async (id: string): Promise<void> => {
//   if (!USE_MOCK) throw new Error("Switch to real API");

//   await delay();

//   mockChildren = mockChildren.filter((c) => c.id !== id);
// };
