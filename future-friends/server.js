require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const chatRoutes = require('./routes/chat');
const teamRoutes = require('./routes/team'); // Add this line to import team routes
const cors = require('cors');
const path = require('path');
const logger = require('./logger');
const Chat = require('./models/chat');

// Import and configure Sentry
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: "https://0407ce84a77488936b845eec59682b14@o4507832110415872.ingest.us.sentry.io/4507837299621888",
  tracesSampleRate: 1.0,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Ensure this matches your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Ensure CORS origin matches your frontend URL
}));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const dbUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/futurefriends';

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(`Connected to MongoDB at ${dbUri}`))
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1); // Exit the application if the database connection fails
});

// Handle WebSocket connections for private chat
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a room based on user ID
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User with ID ${userId} joined room ${userId}`);
  });

  // Handle private messages
  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    if (!senderId || !receiverId) {
      console.error('Failed to save message: senderId and receiverId are required');
      return;
    }

    const newMessage = new Chat({ sender: senderId, receiver: receiverId, message });

    try {
      await newMessage.save();  // Save the message to MongoDB
      io.to(receiverId).emit('receiveMessage', { senderId, receiverId, message }); // Emit to receiver with 'receiveMessage' event
      console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Future-Friends API');
});

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/teams', teamRoutes); // Add this line to use team routes

// Endpoint to receive and log frontend logs
app.post('/log', (req, res) => {
  const { level = 'info', message } = req.body;

  // Log the message to the server logs
  logger.log({ level, message });

  res.status(200).send('Log received');
});

// Error handling middleware (should be after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
