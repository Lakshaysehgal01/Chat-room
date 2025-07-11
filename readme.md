# Chat Room Website

This website is a real-time chat application that allows users to join chat rooms and communicate instantly with others. It is built using WebSockets for fast, bidirectional communication between clients and the server.

## Features

- Join chat rooms with a custom username
- Send and receive messages in real time
- Rooms are created dynamically as users join
- Simple and intuitive user interface

## How It Works

- Users connect to the server and choose a room to join
- Messages sent in a room are broadcast to all other users in that room
- Each message displays the sender's username

## Technologies Used

- WebSockets (for real-time communication)
- TypeScript (for backend server)
- Node.js

## Getting Started

1. Start the backend WebSocket server (see backend/readme.md for instructions)
2. Open the website in your browser
3. Enter a username and room ID to join a chat room
4. Start chatting with others in the same room

## License

MIT
