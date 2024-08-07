const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/users'); 
const postRoutes = require('./routes/posts');  
const cors = require('cors');
const path = require('path');

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
mongoose.connect('mongodb://localhost:27017/futurefriends', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('sendMessage', (msg) => {
    io.emit('receiveMessage', msg);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Future-Friends API');
});

// Use the user routes
app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes); 

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
