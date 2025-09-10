
import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: [process.env.CLIENT_URL,process.env.DASHBOARD_URL],  
  credentials: true
  },
  transports: ["websocket", "polling"], 
});

let onlineUsers = [];

const getUser = (userId) => {
  return onlineUsers.find(user => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('getOnlineUsers', (callback) => {
    callback(onlineUsers.map(u => u.userId));
  });

  socket.on("newUser", async (userId) => {
    try {
      onlineUsers = onlineUsers.filter(u => u.userId !== userId);
      onlineUsers.push({ userId, socketId: socket.id });
      
      socket.join(userId);
      
      await User.findByIdAndUpdate(userId, { 
        isOnline: true,
        $unset: { lastSeen: 1 }
      });
      
      io.emit("onlineUsers", onlineUsers.map(u => u.userId));
    } catch (error) {
      console.error("User connection error:", error);
    }
  });

  socket.on("disconnect", async () => {
    const user = onlineUsers.find(u => u.socketId === socket.id);
    if (user) {
      try {
        await User.findByIdAndUpdate(user.userId, {
          isOnline: false,
          lastSeen: new Date()
        });

        onlineUsers = onlineUsers.filter(u => u.socketId !== socket.id);
        io.emit("onlineUsers", onlineUsers.map(u => u.userId));
      } catch (error) {
        console.error("Disconnection error:", error);
      }
    }
  });

  socket.on('typing', ({ conversationId }) => {
    socket.to(conversationId).emit('userTyping', { conversationId });
  });

  socket.on('stopTyping', ({ conversationId }) => {
    socket.to(conversationId).emit('userStopTyping', { conversationId });
  });

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('leaveConversation', (conversationId) => {
    socket.leave(conversationId);
  });

  // Keep these for real-time reactions/edits/deletes
  socket.on('sendReaction', (data) => {
    io.to(data.conversationId).emit('messageReacted', data);
  });

  socket.on('messageEdited', (data) => {
    io.to(data.conversationId).emit('messageEdited', data);
  });

  socket.on('messageDeleted', (data) => {
    io.to(data.conversationId).emit('messageDeleted', data);
  });
});

export { io, app, server };