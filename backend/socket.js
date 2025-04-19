const socketIo = (io) => {
  // Store all connected users
  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    const user = socket.handshake.auth.user;
    console.log(`User connected: ${user?.username} (${socket.id})`);

    // Join room handler
    socket.on("join room", (groupId) => {
      console.log(`${user?.username} joining room: ${groupId}`);
      
      // Leave any previous rooms
      const rooms = Array.from(socket.rooms);
      rooms.forEach(room => {
        if (room !== socket.id) {
          socket.leave(room);
          console.log(`Left room: ${room}`);
        }
      });

      // Join new room
      socket.join(groupId);
      connectedUsers.set(socket.id, { user, room: groupId });
      
      // Get users in this room
      const usersInRoom = getUsersInRoom(groupId);
      console.log(`Users in room ${groupId}:`, usersInRoom.map(u => u.username));

      // Update clients
      io.to(groupId).emit("users in room", usersInRoom);
      io.emit("update online users", Array.from(connectedUsers.values()).map(u => u.user));

      // Notify room about new user
      socket.to(groupId).emit("notification", {
        type: "USER_JOINED",
        message: `${user?.username} has joined`,
        user: user,
      });
    });

    // Leave room handler
    socket.on("leave room", (groupId) => {
      console.log(`${user?.username} leaving room: ${groupId}`);
      socket.leave(groupId);
      
      if (connectedUsers.has(socket.id)) {
        connectedUsers.delete(socket.id);
        io.to(groupId).emit("user left", user?._id);
        io.emit("update online users", Array.from(connectedUsers.values()).map(u => u.user));
      }
    });

    // Message handler
    socket.on("new message", (message) => {
      if (!message.groupId) {
        console.error("Invalid message - missing groupId");
        return;
      }

      console.log(`New message in ${message.groupId} from ${user?.username}`);
      
      // Add server-side timestamp if missing
      if (!message.createdAt) {
        message.createdAt = new Date().toISOString();
      }

      // Ensure sender info is complete
      const completeMessage = {
        ...message,
        sender: {
          _id: user?._id,
          username: user?.username,
          profilePic: user?.profilePic,
          ...message.sender
        }
      };

      io.to(message.groupId).emit("message received", completeMessage);
    });

    // Typing indicators
    socket.on("typing", ({ groupId, username }) => {
      socket.to(groupId).emit("user typing", { username });
    });

    socket.on("stop typing", ({ groupId }) => {
      socket.to(groupId).emit("user stop typing", { username: user?.username });
    });

    // Disconnect handler
    socket.on("disconnect", () => {
      console.log(`${user?.username} disconnected`);
      if (connectedUsers.has(socket.id)) {
        const { room } = connectedUsers.get(socket.id);
        connectedUsers.delete(socket.id);
        socket.to(room).emit("user left", user?._id);
        io.emit("update online users", Array.from(connectedUsers.values()).map(u => u.user));
      }
    });

    // Error handling
    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });

  function getUsersInRoom(groupId) {
    const users = [];
    const room = io.sockets.adapter.rooms.get(groupId);
    
    if (room) {
      for (const socketId of room) {
        const userData = connectedUsers.get(socketId);
        if (userData) {
          users.push(userData.user);
        }
      }
    }
    
    return users;
  }
};

module.exports = socketIo;