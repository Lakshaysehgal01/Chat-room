import { Copy } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
  const [usersCount, setUsersCount] = useState(1);
  const socketRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
            username: name,
          },
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          const { from, msg: message } = data.payload;
          setMessages((prev) => [...prev, { from, message }]);
        } else if (data.type === "user_count") {
          setUsersCount(data.payload.count);
        } else {
          setMessages((prev) => [
            ...prev,
            { from: "System", message: data.payload || event.data },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { from: "System", message: event.data },
        ]);
      }
    };

    return () => socket.close();
  }, [name, roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: { message: input },
        })
      );
      setMessages((prev) => [...prev, { from: name, message: input }]);
      setInput("");
    }
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.info("Room Code Copied")
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="w-full mx-auto text-white p-6 rounded-xl border border-zinc-800 bg-zinc-900 shadow-md">
      <h1 className="text-xl font-bold mb-1">💬 Real Time Chat</h1>
      <p className="text-sm text-zinc-400 mb-4">
        temporary room that expires after all users exit
      </p>

      <div className="flex items-center justify-between bg-zinc-800 text-sm rounded-md px-4 py-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Room Code:</span>
          <span className="font-mono text-white">{roomId}</span>
          <button onClick={handleCopyRoomId}>
            <Copy size={16} />
          </button>
        </div>
        <div>Users: {usersCount}</div>
      </div>

      <div className="h-72 overflow-y-auto mb-4 bg-black border border-zinc-800 rounded-md p-2">
        {messages.map((msg, idx) => {
          const isSelf = msg.from === name;

          return (
            <div
              key={idx}
              className={`mb-2 flex ${
                isSelf ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-[75%] text-sm">
                <div
                  className={`text-xs mb-1 ${
                    isSelf
                      ? "text-right text-zinc-400"
                      : "text-left text-zinc-400"
                  }`}
                >
                  {msg.from}
                </div>
                <div
                  className={`inline-block px-4 py-2 rounded-xl ${
                    isSelf
                      ? "bg-white text-black rounded-br-none"
                      : "bg-zinc-800 text-white rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center border border-zinc-700 rounded-md overflow-hidden">
        <input
          type="text"
          className="flex-1 bg-black px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-zinc-200 transition-all"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
