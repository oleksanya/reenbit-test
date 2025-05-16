const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? true // Allow any origin in production
        : "http://localhost:4200",
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
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  const userSockets = new Map();

  io.on('connection', (socket) => {
    if (!socket.userId) {
      socket.disconnect();
      return;
    }

    console.log(`User connected: ${socket.userId}`);
    userSockets.set(socket.userId, socket);    socket.join(socket.userId);
    
    socket.on('sendMessage', async (message) => {
      // Get recipient's socket and also broadcast globally
      const recipients = [message.senderId, message.receiverId];
      
      // Send to specific recipients for direct messaging
      recipients.forEach(userId => {
        if (userId !== socket.userId) {
          io.to(userId).emit('newMessage', message);
        }
      });
      
      // Also broadcast globally for reliability
      io.emit('newMessage', message);
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
