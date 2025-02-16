import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Check if user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      console.error("Error in checkAuth:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed. Try again.");
    }
  },

  // Update profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
        const res = await axiosInstance.put("/auth/update-profile", data, {
            headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
        });

        console.log("Updated user response:", res.data); // Debugging log

        set((state) => ({
            authUser: { ...state.authUser, profilePic: res.data.profilePic }, // ✅ Fix field mismatch
        }));

        toast.success("Profile updated successfully");
    } catch (error) {
        console.error("Error in updateProfile:", error);
        toast.error(error.response?.data?.message || "Failed to update profile. Try again.");
    } finally {
        set({ isUpdatingProfile: false });
    }
},

}));
