import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

 

axios.defaults.withCredentials = true;

export const useAuthStore = create((set,get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  daysRemaining: 0,
setUser: (userData) => set({ user: userData }),
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
      return response.data.user;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
//   checkAuth: async () => {
//     set({ isCheckingAuth: true, error: null });

//     try {
//       const response = await axios.get(`${API_URL}/check-auth`, {
//         withCredentials: true,
//         validateStatus: (status) => status < 500,
//       });

//       // Not logged in (token missing / expired)
//       if (response.status === 401 || !response.data?.user) {
//         return set({
//           user: null,
//           isAuthenticated: false,
//           isCheckingAuth: false,
//         });
//       }

//       // Logged in
//       set({
//         user: response.data.user,
//         isAuthenticated: true,
//         isCheckingAuth: false,
//       });
//     } catch (error) {
//       // Only server/network errors
//       set({
//         user: null,
//         isAuthenticated: false,
//         isCheckingAuth: false,
//       });
//     }
//   },


checkAuth: async () => {
  set({ isCheckingAuth: true, error: null });

  try {
    const response = await axios.get(`${API_URL}/check-auth`, {
      withCredentials: true,
      validateStatus: (status) => status < 500,
    });

    set({
      user: response.data.user,
      daysRemaining: response.data.daysRemaining,
      isAuthenticated: response.data.user ? true : false,
      isCheckingAuth: false,
    });
  } catch (error) {
    set({ isCheckingAuth: false });
  }
},



  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },

 updateProfile: async (updatedData) => {
    set({ isLoading: true });
    try {
      const token = get().token; // get the JWT token

      console.log("Sending FormData to backend...");
      for (let [key, value] of updatedData.entries()) {
        console.log(key, value);
      }

      const res = await axios.put(`${API_URL}/update-profile`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`, // send JWT
          // ✅ Do NOT set Content-Type manually
        },
      });

      console.log("Update response:", res.data);

      set({ user: res.data, isLoading: false });
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      set({
        error: error.response?.data?.message || "Update failed",
        isLoading: false,
      });
    }
  },

incrementUsage: () =>
    set((state) => {
      if (state.user) {
        return {
          user: {
            ...state.user,
            serviceUsageCount: state.user.serviceUsageCount + 1,
          },
        };
      }
      return state;
    }),


fetchAllUsers: async () => {
  try {
    const res = await axios.get(`${API_URL}/users`);
    return res.data.users;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data?.message || error);
    throw error;
  }
},

}));
