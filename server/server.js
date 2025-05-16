require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const cors = require('cors');

const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? true // Allow requests from any origin in production
      : 'http://localhost:4200', // Only from this origin in development
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Handle client paths consistently
const clientPath = path.join(__dirname, '../client/dist/client');
const indexPath = path.join(clientPath, 'index.html');

// Serve static files
app.use(express.static(clientPath));

// All other routes return the index.html file
app.get('*', (req, res) => {
  res.sendFile(indexPath);
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
const server = require('http').createServer(app);
const setupSocketIO = require('./socket');

const io = setupSocketIO(server);

// Make io available to our route handlers
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
