import { create } from "zustand";

// --- CONFIGURATION ---
const SYSTEM_PROMPT = "How can I help you today? You can send a prompt or upload a PDF for a guided study session.";

// Use the base URL for the API calls
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // Base URL for the services
    : ""; // Assuming root path for production

// Utility to generate consistent timestamps
const getCurrentTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

// Initial conversation state
const initialMessages = [
  { id: 1, sender: 'bot', type: 'text', content: SYSTEM_PROMPT, timestamp: getCurrentTime() },
];

// ----------------------------------------------------
// Chat Store Definition (Zustand)
// ----------------------------------------------------

export const useChatStore = create((set, get) => ({
  // State variables for the chat session
  messages: initialMessages,
  isLoading: false,
  error: null,
  // Unique session ID for persistent interaction with the backend
  sessionId: crypto.randomUUID(),

  // Actions to set the state
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (value) => set({ error: value }),
  /**
   * Directly replaces the messages array.
   * This was missing and caused the TypeError in handleAnswerQuestion.
   * @param {Array} newMessages - The new array of messages.
   */
  setMessages: (newMessages) => set({ messages: newMessages }), // <-- FIX: ADDED MISSING ACTION

  /**
   * Adds a new message to the conversation history.
   * @param {Object} message - The message object.
   */
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),

  /**
   * Updates the conversation to remove the `isWaitingForResponse` flag
   * from the previous bot message and returns the updated array.
   * @param {Array} currentMessages - The current state of messages.
   * @param {Object} userAnswer - The new user message to append.
   */
  processAnswerSubmission: (currentMessages, userAnswer) => {
    // 1. Remove waiting flag from previous bot question
    const updatedMessages = currentMessages.map(msg =>
      msg.isWaitingForResponse ? { ...msg, isWaitingForResponse: false } : msg
    );
    // 2. Append user answer
    return [...updatedMessages, userAnswer];
  },

  /**
   * Handles the initial message/file upload to start a guided study session.
   * @param {string} input - The user's text input (or file name text).
   * @param {File | null} file - The optional PDF file.
   */
  handleSendMessage: async (input, file) => {
    const { addMessage, setIsLoading, setError, sessionId } = get();

    // The component should handle the empty check, but we validate here for safety
    if (!input.trim() && !file) return;

    // 1️⃣ Add user message to chat
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: input.trim() || `Uploaded file: ${file.name}`,
      timestamp: getCurrentTime(),
    };

    addMessage(userMessage);
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      if (file) formData.append("file", file);
      else formData.append("prompt", userMessage.content);

      // Using exponential backoff for API calls
      const url = `${API_BASE_URL}/study/start`;
      let response;
      let delay = 1000;
      const maxRetries = 3;

      for (let i = 0; i < maxRetries; i++) {
          response = await fetch(url, { method: "POST", body: formData });
          if (response.ok) break;
          if (i < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, delay));
              delay *= 2;
          } else {
              throw new Error("Failed to get response from backend after retries.");
          }
      }

      const data = await response.json();

      // 2️⃣ Add bot response (first question)
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'question',
        content: data.question,
        isWaitingForResponse: true,
        timestamp: getCurrentTime(),
      };

      addMessage(botMessage);

    } catch (err) {
      console.error("Error starting session:", err);

      // Add error message to chat
      addMessage({
        id: Date.now() + 2,
        sender: 'bot',
        type: 'text',
        content: "❌ Failed to start session. Try again.",
        timestamp: getCurrentTime(),
      });

      setError("Failed to start session.");

    } finally {
      setIsLoading(false);
    }
  },

  /**
   * Handles the user's answer submission during a guided session.
   * @param {string} input - The user's answer text.
   */
  handleAnswerQuestion: async (input) => {
    // setMessages is now defined on the store and available via get()
    const { messages, setMessages, addMessage, setIsLoading, setError, sessionId, processAnswerSubmission } = get();

    if (!input.trim()) return;

    const userAnswer = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: input.trim(),
      timestamp: getCurrentTime(),
    };

    setIsLoading(true);
    setError(null);

    // Update messages state: remove waiting flag and append user answer
    setMessages(processAnswerSubmission(messages, userAnswer));

    try {
      // 2. Call backend API
      const url = `${API_BASE_URL}/study/answer`;
      const bodyPayload = JSON.stringify({
          sessionId: sessionId,
          answer: input.trim(),
      });

      // Using exponential backoff for API calls
      let response;
      let delay = 1000;
      const maxRetries = 3;

      for (let i = 0; i < maxRetries; i++) {
          response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: bodyPayload,
          });
          if (response.ok) break;
          if (i < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, delay));
              delay *= 2;
          } else {
              throw new Error("Failed to get response from backend after retries.");
          }
      }

      const data = await response.json();

      // 3. Add correction message from bot
      addMessage({
        id: Date.now() + 1,
        sender: 'bot',
        type: 'text',
        content: data.correction,
        timestamp: getCurrentTime(),
      });

      // 4. Add next question
      addMessage({
        id: Date.now() + 2,
        sender: 'bot',
        type: 'question',
        content: data.question,
        isWaitingForResponse: true,
        timestamp: getCurrentTime(),
      });

    } catch (error) {
      console.error("Error submitting answer:", error);

      // Add error message to chat
      addMessage({
        id: Date.now() + 1,
        sender: 'bot',
        type: 'text',
        content: "❌ An error occurred. Please try again.",
        timestamp: getCurrentTime(),
      });

      setError("Error submitting answer.");

    } finally {
      setIsLoading(false);
    }
  },
}));