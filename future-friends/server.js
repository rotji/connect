require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/users'); 
const postRoutes = require('./routes/posts');  
const cors = require('cors');
const path = require('path');
const logger = require('./logger');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(express.json());
app.use(cors()); 

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
  socket.on('privateMessage', ({ senderId, receiverId, message }) => {
    io.to(receiverId).emit('privateMessage', { senderId, message });
    console.log(`Private message from ${senderId} to ${receiverId}: ${message}`);
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

// Use the user routes (no token authentication required)
app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes); 

// Endpoint to receive and log frontend logs
app.post('/log', (req, res) => {
  const { level = 'info', message } = req.body;
  
  // Log the message to the server logs
  logger.log({ level, message }); 

  res.status(200).send('Log received');
});

// Add error handling for JSON response
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' }); 
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
