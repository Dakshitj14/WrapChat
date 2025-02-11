import { create } from "zustand";

import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";   

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,
  checkAuth: async () => {

    try{
        const res = await axiosInstance.get("/auth/check");

        set({authUser: res.data});
    } catch(error){
        set({authUser: null});
        console.log("error in checkAuth", error);
    }finally{
        set({isCheckingAuth: false});
    }
  },


  signup: async (data) => {
    try {
        const res = await axiosInstance.post("/auth/signup", data);
        set({authUser: res.data});
        toast.success("Account created successfully");
    }
     catch (error) {
        toast.error(error.response.data.message);
    } finally {
        set({isSigningUp: false});
    }

  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));