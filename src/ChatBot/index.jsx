import { useState, useRef, useEffect} from "react";
import { sendMessage } from "../helperFunctions/sendMessage.js";
import './style.css'


export default function Chatbot() {

const [messages, setMessages] = useState([
  { role: "model", content: "Hi 👋, I’m your KindBite Assistant. How can I help you today?" }
]);

const [input, setInput] = useState("");
const [isOpen, setIsOpen] = useState(false);
const [isSending, setIsSending] = useState(false);

const messagesRef = useRef(null);

useEffect(() => {
  if (isOpen) {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [isOpen, messages]); // 👈 run on both open and new messages



const handleSend = async () => {
 
   if (!input.trim() || isSending) 
   return;

  const newMessage = { role: "user", content: input };
  const updatedHistory = [...messages, newMessage];
  setMessages(updatedHistory);
  setIsSending(true);     // ✅ lock send button

  try {
    const reply = await sendMessage(input, updatedHistory);
    setMessages([...updatedHistory, { role: "model", content: reply }]);
  } 
  catch (error) {
    console.error("Chatbot error:", error);
    setMessages([...updatedHistory, { role: "model", content: "⚠️ Sorry, I couldn't answer right now." }]);
  }
  finally {
      setIsSending(false); // unlock send button after reply
  }

  setInput("");
};


return (
    <div className="chatbot-container">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (

        <div className="chatbot">

          <div className="chat-header">
            <span>KindBite Assistant 🤖</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chat-window">
            {messages.map((msg, i) => (
              <div
                key={i}
                ref={i === messages.length - 1 ? messagesRef : null}  // 👈 ref only on last message
                className={`message ${msg.role === "user" ? "user" : "bot"}`}
              >
                <div className="bubble">{msg.content}</div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isSending} // ✅ lock input
            />
            
           <button onClick={handleSend} disabled={isSending} className="send-btn">
              {isSending ? <span className="spinner"></span> : "➤"}
            </button>
          </div>
          
        </div>
      )}

    </div>
  );
}


