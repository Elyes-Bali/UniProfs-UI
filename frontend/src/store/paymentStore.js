import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore"; // To access the user data

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/payment"
    : "/api/payment";

export const usePaymentStore = create((set, get) => ({
  isLoading: false,
  error: null,

  /**
   * Initiates the Stripe checkout session by calling the backend API.
   * Redirects the user to the Stripe payment page on success.
   * @param {string} planName - Name of the plan to subscribe to.
   * @param {number} price - Price of the plan.
   */
  subscribeToPlan: async (planName, price) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      alert("Please log in to subscribe.");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const res = await axios.post(
        `${API_URL}/create-checkout-session`,
        { userId: user._id, planName, price },
        { withCredentials: true }
      );

      set({ isLoading: false });
      
      // Redirect the user to the Stripe Checkout page
      window.location.href = res.data.url;
      
    } catch (err) {
      console.error("Payment initiation error:", err.response?.data || err);
      set({
        isLoading: false,
        error: err.response?.data?.message || "Payment initiation failed!",
      });
      alert(err.response?.data?.message || "Payment failed!");
      throw err; // Re-throw if you want the calling component to handle it further
    }
  },
}));