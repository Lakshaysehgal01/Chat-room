import { useState } from "react";

import { Copy, LoaderCircle, MessageCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import Chat from "./component/Chat";
function App() {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  function generateRoomCode() {
    setLoading(true);
    setTimeout(() => {
      const str = "abcdefghijklmnopqrstuvwxyz1234567890";
      const n = str.length;
      let ans = "";
      for (let i = 0; i < 5; i++) {
        ans += str[Math.floor(Math.random() * n)];
      }
      setRoomCode(ans);
      setLoading(false);
      toast.success("Room Code Created");
    }, 2000);
  }
  const handleCopy = () => {
    navigator.clipboard
      .writeText(roomCode)
      .then(() => {
        toast.success("Code copied to clipboard");
      })
      .catch(() => {
        toast.error("Error while coping");
      });
  };
  const handleJoin = () => {
    if (name.trim() && roomId.trim()) {
      setJoined(true);
    } else {
      toast.error("Please fill the feilds");
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-mono ">
      <Toaster />
      <div className="rounded-xl border bg-[#0a0a0a] text-white shadow sm:w-[672px] w-full border-white/20 ">
        {!joined ? (
          <div>
            <div className="flex flex-col p-6 space-y-1">
              <div className="tracking-tight text-2xl flex items-center gap-2 font-bold">
                <MessageCircle className="w-6 h-6" />
                Real Time Chat
              </div>
              <div className="text-sm text-whitev opacity-70">
                temporary room that expires after all users exit
              </div>
            </div>
            <div className="p-6 pt-1">
              <div className="space-y-4">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 bg-[#fbfbfa] text-[#292828] shadow hover:bg-[#fbfbfa]/90  h-10 rounded-md px-8 w-full text-lg py-6"
                  onClick={generateRoomCode}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center font-semibold gap-2">
                      Creating Room
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    </span>
                  ) : (
                    <span className="font-semibold">Create new room</span>
                  )}
                </button>
                <div className="flex gap-2">
                  <input
                    className="flex h-9 w-full rounded-md border border-[#bcbcbc]/30 bg-transparent px-3 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#bcbcbc] placeholder:text-[#bcbcbc] focus-visible:border-[#bcbcbc]/90 focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-lg py-5"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex h-9 w-full rounded-md border border-[#bcbcbc]/30 bg-transparent px-3 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#bcbcbc] placeholder:text-[#bcbcbc] focus-visible:border-[#bcbcbc]/90 focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-lg py-5"
                    placeholder="Enter Room Code"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap  font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 bg-[#fbfbfa] text-[#292828] shadow hover:bg-[#fbfbfa]/90  h-10 rounded-md px-8 text-sm"
                    onClick={handleJoin}
                  >
                    Join Room
                  </button>
                </div>
                {roomCode.length > 0 && (
                  <div className="text-center p-6 bg-[#262727] rounded-lg">
                    <p>Share this code with your friends</p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <span className="font-mono text-2xl font-bold">
                        {roomCode}
                      </span>
                      <button className="pl-2" onClick={handleCopy}>
                        <Copy />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Chat name={name} roomId={roomId} />
        )}
      </div>
    </div>
  );
}

export default App;
