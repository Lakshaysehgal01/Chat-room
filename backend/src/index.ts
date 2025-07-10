import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const arina = new Map<string, Set<WebSocket>>();
// {"room1":socket1,socket2}

const user = new Map<WebSocket, string>();
// this tells users is in which room

const userName = new Map<WebSocket, string>();
//store username

wss.on("connection", (socket) => {
  socket.on("error", console.error);

  socket.on("message", (data) => {
    try {
      const { type, payload } = JSON.parse(data.toString());
      if (type == "join") {
        const roomId = payload?.roomId;
        if (!roomId) return socket.send("Missing roomId");
        let name: string = payload?.username;
        if (!name) name = "Anonymous";
        if (!arina.has(roomId)) {
          arina.set(roomId, new Set());
        }
        arina.get(roomId)?.add(socket);
        user.set(socket, roomId);
        userName.set(socket, name);
        socket.send("User joined room " + roomId);
      } else if (type === "chat") {
        const msg = payload?.message;
        if (!msg) {
          return socket.send("Missing message feild in chat payload");
        }
        const roomId = user.get(socket);
        const name = userName.get(socket);
        if (!roomId) return socket.send("You are not in a room ");
        const roomMembers = arina.get(roomId);
        if (!roomMembers) return;
        roomMembers.forEach((member) => {
          if (member != socket && member.readyState == WebSocket.OPEN) {
            member.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  msg,
                  from: name,
                },
              })
            );
          }
        });
      } else {
        socket.send("Unknown message type");
      }
    } catch (error) {
      socket.send("Invalid Json");
    }

    socket.on("close", () => {
      const roomId = user.get(socket);
      if (roomId) {
        arina.get(roomId)?.delete(socket);
        if (arina.get(roomId)?.size === 0) {
          arina.delete(roomId);
        }
        userName.delete(socket);
        user.delete(socket);
      }
    });
  });
});
