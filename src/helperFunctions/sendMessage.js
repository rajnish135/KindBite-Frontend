import axios from "axios";

export async function sendMessage(message, history) {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("Backend URL is not configured. Please set VITE_BACKEND_URL in your environment variables.");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("You must be logged in to use the chatbot.");
    }

    const res = await axios.post(
      `${backendUrl}/api/chat`,
      { message, history },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.data || !res.data.reply) {
      throw new Error("Invalid response from server");
    }

    return res.data.reply;  
  } catch (error) {
    console.error("Error sending message:", error);
    
    // Provide more specific error messages
    if (error.response) {
      // Server responded with error status
      const errorMsg = error.response.data?.error || error.response.statusText || "Server error";
      throw new Error(errorMsg);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Unable to connect to the server. Please check your internet connection.");
    } else {
      // Something else happened
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}
