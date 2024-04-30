const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const Chat = require('./models/chat-model');

function setupSocketIO(app) {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected.`);

    let chatHistory = [];

    socket.on('message', async (messageData) => {
      const { sender, receiver, content } = messageData
      console.log('Received message:', messageData);

      const newMessage = new Chat({
        sender,
        receiver,
        content,
        timestamp: new Date(),
      });
      try {
        io.emit('chatHistory', chatHistory);
        io.emit('message', newMessage);
        chatHistory.push(newMessage);
        await newMessage.save();
        console.log('Message saved to database:', newMessage);
        console.log('Chat history:', chatHistory);
      } catch (error) {
        console.error('Error saving message to database:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected.`);
    });
  });

  return { io, httpServer };
}

const app = express();
const { io, httpServer } = setupSocketIO(app);

httpServer.listen(8000, () => {
  console.log('Socket.io server running on http://localhost:8000');
});

module.exports = { setupSocketIO };
