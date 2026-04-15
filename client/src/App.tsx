import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Room from "./pages/Room";
const socket = io("http://localhost:5000");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<{ message: string; sender: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const roomId = "test-room-123";

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("Connected:", socket.id);
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Disconnected");
    }

    function onReceiveMessage(data: { message: string; sender: string }) {
      setMessages((prev) => [...prev, data]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-message", onReceiveMessage);

    socket.emit("join-room", roomId);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive-message", onReceiveMessage);
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      socket.emit("send-message", { roomId, message: inputMessage });
      setMessages((prev) => [...prev, { message: inputMessage, sender: "me" }]);
      setInputMessage("");
    }
  };

  return (
    <div style={{ 
      padding: "20px", 
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      boxSizing: "border-box"
    }}>
      <div>
        <h1 style={{ marginBottom: "8px", textAlign: "center" }}>Interviewly Socket Status</h1>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px", 
          justifyContent: "center",
          fontSize: "16px"
        }}>
          <span style={{ 
            width: "10px", 
            height: "10px", 
            borderRadius: "50%", 
            background: isConnected ? "#4ade80" : "#f87171",
            display: "inline-block"
          }}></span>
          <span style={{ fontWeight: 500 }}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          {isConnected && socket.id && (
            <code style={{ fontSize: "12px" }}>ID: {socket.id}</code>
          )}
        </div>
      </div>

      <Room />

      <div style={{ 
        background: "var(--social-bg)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "20px",
        height: "450px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "var(--shadow)"
      }}>
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          display: "flex", 
          flexDirection: "column", 
          gap: "12px",
          paddingRight: "8px"
        }}>
          {messages.length === 0 && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              height: "100%",
              color: "var(--text)",
              opacity: 0.6
            }}>
              No messages in this room yet.
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} style={{ 
              alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
              maxWidth: "75%"
            }}>
              <div style={{ 
                background: msg.sender === "me" ? "var(--accent)" : "var(--code-bg)",
                color: msg.sender === "me" ? "white" : "var(--text-h)",
                padding: "10px 16px",
                borderRadius: msg.sender === "me" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                fontSize: "15px",
                lineHeight: "1.4",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}>
                {msg.message}
              </div>
              <div style={{ 
                fontSize: "11px", 
                marginTop: "4px", 
                textAlign: msg.sender === "me" ? "right" : "left",
                color: "var(--text)",
                opacity: 0.8
              }}>
                {msg.sender === "me" ? "You" : `User ${msg.sender.slice(0, 4)}`}
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          display: "flex", 
          gap: "12px",
          borderTop: "1px solid var(--border)",
          paddingTop: "16px"
        }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            style={{ 
              flex: 1, 
              padding: "12px 16px", 
              borderRadius: "12px", 
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-h)",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            style={{ 
              padding: "0 24px", 
              borderRadius: "12px", 
              border: "none", 
              background: "var(--accent)", 
              color: "white", 
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 0.1s, opacity 0.2s"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;