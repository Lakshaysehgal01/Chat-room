import { WebSocket } from "ws";

export function broadcastUserCount(
  roomId: string,
  arina: Map<string, Set<WebSocket>>
) {
  const members = arina.get(roomId);
  if (!members) return;

  const message = JSON.stringify({
    type: "user_count",
    payload: {
      count: members.size,
    },
  });

  for (const member of members) {
    if (member.readyState === WebSocket.OPEN) {
      member.send(message);
    }
  }
}
