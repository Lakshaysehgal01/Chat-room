# Chat Room WebSocket Server

This is a simple WebSocket-based chat room server implemented in TypeScript using the `ws` library. It allows multiple users to join chat rooms and exchange messages in real time.

## Features
- Users can join a chat room by specifying a room ID and username.
- Messages sent by a user are broadcast to all other users in the same room.
- Rooms are created dynamically when a user joins a new room.
- Usernames are stored and included with each message.

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm

### Installation
1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Server
Start the WebSocket server on port 8080:
```sh
npm start
```

## WebSocket API

### Message Types
All messages should be sent as JSON objects with a `type` and `payload` field.

#### 1. Join Room
- **Type:** `join`
- **Payload:** `{ "roomId": string, "username": string }`
- **Example:**
  ```json
  { "type": "join", "payload": { "roomId": "room1", "username": "Alice" } }
  ```
- **Response:**
  - On success: `User joined room room1`
  - On error: `Missing roomId`

#### 2. Send Chat Message
- **Type:** `chat`
- **Payload:** `{ "message": string }`
- **Example:**
  ```json
  { "type": "chat", "payload": { "message": "Hello everyone!" } }
  ```
- **Response:**
  - On error: `Missing message feild in chat payload` or `You are not in a room `
  - On success: Broadcasts to all other users in the room:
    ```json
    { "type": "chat", "payload": { "msg": "Hello everyone!", "from": "Alice" } }
    ```

### Error Handling
- If a message is not valid JSON: `Invalid Json`
- If the message type is unknown: `Unknown message type`

## Project Structure
```
backend/
  package.json
  tsconfig.json
  src/
    index.ts
```

## License
MIT
