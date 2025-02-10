import toast from 'react-hot-toast';
import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    
    isCheckingAuth: true,

// checking auth
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({
                authUser: res.data,
            })
        } catch (error) {
            set({authUser: null})
        }

        finally {
            set({isCheckingAuth: false})
        }
    },
    // signup
    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({
                authUser: res.data,
            })
            toast.success("Account created successfully");
        } catch (error) {
            toast.error("Error creating account");
        }
        finally {
            set({isSigningUp: false})
        }
    },

}));