import axios from "axios";

export async function sendMessage(message, history) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
      { message, history },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data.reply;  
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
