const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // Using id from JWT token
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  const userSockets = new Map();

  // Handle socket connections
  io.on('connection', (socket) => {
    if (!socket.userId) {
      socket.disconnect();
      return;
    }

    console.log(`User connected: ${socket.userId}`);
    userSockets.set(socket.userId, socket);

    // Join user to their specific room
    socket.join(socket.userId);

    // Handle new messages
    socket.on('sendMessage', async (message) => {
      // Get recipient's socket
      const recipients = [message.senderId, message.receiverId];
      recipients.forEach(userId => {
        if (userId !== socket.userId) {
          io.to(userId).emit('newMessage', message);
        }
      });
    });

    // Handle message editing
    socket.on('editMessage', async ({ messageId, content, chatId, recipientId }) => {
      if (recipientId) {
        io.to(recipientId).emit('messageEdited', { messageId, content, chatId });
      }
    });

    // Handle message deletion
    socket.on('deleteMessage', async ({ messageId, chatId, recipientId }) => {
      if (recipientId) {
        io.to(recipientId).emit('messageDeleted', { messageId, chatId });
      }
    });

    // Handle typing indicators
    socket.on('typing', ({ chatId, recipientId }) => {
      if (recipientId) {
        io.to(recipientId).emit('userTyping', {
          userId: socket.userId,
          chatId
        });
      }
    });

    socket.on('disconnect', () => {
      const userId = socket.userId;
      console.log(`User disconnected: ${userId}`);
      userSockets.delete(userId);
      socket.leave(userId);
    });

    socket.on('error', (error) => {
      console.error('Socket error for user', socket.userId, ':', error);
    });
  });
  return io;
}

module.exports = setupSocketIO;
