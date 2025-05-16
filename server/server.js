require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

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
