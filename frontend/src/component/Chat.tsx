import React, { useEffect, useRef, useState } from "react";

interface ChatProps {
  name: string;
  roomId: string;
}

interface ChatMessage {
  from: string;
  message: string;
}

const Chat: React.FC<ChatProps> = ({ name, roomId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
            name,
          },
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          const { from, message } = data.payload;
          setMessages((prev) => [...prev, { from, message }]);
        } else {
          // Handle system messages (like "joined successfully")
          setMessages((prev) => [
            ...prev,
            { from: "System", message: event.data },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { from: "System", message: event.data },
        ]);
      }
    };

    return () => {
      socket.close();
    };
  }, [name, roomId]);

  const sendMessage = () => {
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: input,
          },
        })
      );
      setMessages((prev) => [...prev, { from: name, message: input }]);
      setInput("");
    }
  };

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid gray",
          padding: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.from}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
