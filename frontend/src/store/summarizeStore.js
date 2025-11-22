import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore"; // Import the auth store to use incrementUsage

// Use the base URL for the API calls
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // Base URL for the services
    : ""; // Assuming root path for production

// ----------------------------------------------------
// Summarize Store Definition
// ----------------------------------------------------

export const useSummarizeStore = create((set, get) => ({
  // State variables for the summarize process
  summary: "",
  loading: false,
  progress: 0,
  error: null,
  showUpgradePopup: false, // State to trigger the upgrade modal

  // Actions to set the state
  setSummary: (value) => set({ summary: value }),
  setLoading: (value) => set({ loading: value }),
  setProgress: (value) => set({ progress: value }),
  setError: (value) => set({ error: value }),
  setShowUpgradePopup: (value) => set({ showUpgradePopup: value }),

  /**
   * Handles the CV summarization process using Server-Sent Events (SSE) streaming.
   * @param {File} file - The PDF file to summarize.
   * @param {Object} settings - Configuration settings for summarization.
   * @param {Function} checkLimit - Function from component to check client-side usage limit.
   * @param {boolean} hasPaid - Boolean indicating if the user has a paid plan.
   */
  handleSummarize: async (file, settings, checkLimit, hasPaid) => {
    // 1. 🔥 CLIENT-SIDE LIMIT CHECK: Prevents API call entirely if limit is hit
    if (checkLimit()) return;

    if (!file) {
      get().setError("Please select a PDF file first.");
      return;
    }

    set({ loading: true, summary: "", progress: 0, error: null });

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("settings", JSON.stringify(settings));

    const url = `${API_BASE_URL}/summarize`;
    const incrementUsage = useAuthStore.getState().incrementUsage;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        // 2. 🔥 API RESPONSE CHECK: Handle 403 response from backend usage middleware
        if (response.status === 403) {
            set({ loading: false, progress: 0, showUpgradePopup: true });
            throw new Error("Usage limit reached. Upgrade required.");
        }

        if (!response.ok) {
            set({ loading: false, progress: 0 });
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const processBuffer = (currentBuffer) => {
            let messages = currentBuffer.split("\n\n");
            let newBuffer = messages.pop() || ""; // Keep incomplete message chunk

            for (const message of messages) {
                if (message.trim() === "") continue;

                const lines = message.split("\n");
                let event = null;
                let data = null;

                for (const line of lines) {
                    if (line.startsWith("event: ")) {
                        event = line.substring(7).trim();
                    } else if (line.startsWith("data: ")) {
                        try {
                            data = JSON.parse(line.substring(6).trim());
                        } catch (e) {
                            console.warn("Failed to parse JSON data:", line, e);
                        }
                    }
                }

                if (event && data) {
                    if (event === "progress") {
                        set({ progress: data.progress });
                    } else if (event === "summary") {
                        set({ summary: data.summary, progress: 100 });
                    } else if (event === "error") {
                        alert(data.message); // Use alert as in original code
                        set({ loading: false, error: data.message });
                        return ""; // Stop processing buffer
                    }
                }
            }
            return newBuffer;
        };

        const processStream = async ({ done, value }) => {
            if (done) {
                processBuffer(buffer);
                set({ loading: false, progress: 100 });
                // Increment usage only if not a paid user and the process finished
                if (!hasPaid) {
                    incrementUsage();
                }
                return;
            }

            buffer += decoder.decode(value, { stream: true });
            buffer = processBuffer(buffer);

            // Continue reading the next chunk
            return reader.read().then(processStream);
        };

        // Start reading the stream
        await reader.read().then(processStream);

    } catch (err) {
        console.error("Error during streaming or fetch:", err);
        if (err.message.indexOf("Usage limit reached") === -1) {
            // Only set error if it's not the handled limit error
            set({ error: "Error while summarizing PDF." });
        }
        set({ summary: "", loading: false, progress: 0 });
    }
  },

  /**
   * Handles the CV improvement process and triggers a file download.
   * @param {File} file - The PDF file to improve.
   * @param {Object} settings - Configuration settings (optional).
   * @param {Function} checkLimit - Function from component to check client-side usage limit.
   * @param {boolean} hasPaid - Boolean indicating if the user has a paid plan.
   */
  handleImproveCV: async (file, settings, checkLimit, hasPaid) => {
    // 1. 🔥 CLIENT-SIDE LIMIT CHECK: Prevents API call entirely if limit is hit
    if (checkLimit()) return;

    if (!file) {
      get().setError("Please upload a PDF first.");
      return;
    }

    set({ loading: true, summary: "", progress: 0, error: null });

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("settings", JSON.stringify(settings));

    const incrementUsage = useAuthStore.getState().incrementUsage;

    try {
      // 2. 🔥 API CALL (using axios for simplicity since it's not streaming)
      const response = await axios.post(
        `${API_BASE_URL}/improve-cv`,
        formData,
        {
          withCredentials: true, // Use default from authStore setup
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // Important for receiving a file stream/blob
          // Ensure we don't throw on 403 so we can catch and handle it
          validateStatus: (status) => status >= 200 && status < 500, 
        }
      );

      // 3. 🔥 SERVER-SIDE LIMIT CHECK: Handle 403 response
      if (response.status === 403) {
        set({ showUpgradePopup: true });
        throw new Error("Usage limit reached. Please upgrade your plan.");
      }
      
      if (response.status !== 200) {
        throw new Error(`Failed to improve CV. Status: ${response.status}`);
      }

      // Handle successful file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Improved-CV.pdf");
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url); // Clean up

      if (!hasPaid) {
        incrementUsage();
      }
    } catch (error) {
      console.error("Error improving CV:", error.response?.data || error);
      // Only show alert if it's not the usage limit error
      if (error.message && error.message.indexOf("Usage limit reached") === -1) {
        get().setError("Failed to improve CV. Please try again.");
      }
    } finally {
      set({ loading: false, progress: 0 });
    }
  },
}));