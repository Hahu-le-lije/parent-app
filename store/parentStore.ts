import { create } from "zustand";

type ParentStore = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  password: string;
  confirmPassword: string;

  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;

  remove: () => void;
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  
  password: "",
  confirmPassword: "",
};

export const parentStore = create<ParentStore>((set) => ({
  ...initialState,

  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),

  remove: () => set(initialState),
}));