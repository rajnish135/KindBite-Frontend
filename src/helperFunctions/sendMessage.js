import axios from "axios";

export async function sendMessage(message, history) {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/chat",
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
