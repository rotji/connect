require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const chatRoutes = require('./routes/chat');
const teamRoutes = require('./routes/team');
const cors = require('cors');
const path = require('path');
const logger = require('./logger');
const Chat = require('./models/chat');
const User = require('./models/User');
const Post = require('./models/Post'); // Ensure this is included

// Import multer for handling file uploads
const multer = require('multer');

// Import and configure Sentry
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Use an environment variable for the DSN
  tracesSampleRate: 1.0,
});

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const dbUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/futurefriends';
mongoose.set('strictQuery', false);
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true
})
.then(() => console.log(`Connected to MongoDB at ${dbUri}`))
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Route to handle profile picture upload
app.post('/api/upload-profile-pic', upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const profilePicUrl = `/uploads/${req.file.filename}`;
  const userEmail = req.body.email;

  User.findOneAndUpdate({ email: userEmail }, { profilePic: profilePicUrl }, { new: true }, (err, updatedUser) => {
    if (err) return res.status(500).json({ error: 'Error updating profile picture' });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  });
});

// WebSocket event handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (email) => {
    if (email) {
      socket.join(email);
      console.log(`User with email ${email} joined room ${email}`);
    } else {
      console.log('Failed to join room: missing email');
    }
  });

  socket.on('join-room', ({ email, room }) => {
    if (email && room) {
      socket.join(room);
      console.log(`User with email ${email} joined room ${room}`);
    } else {
      console.log('Failed to join room: missing email or room');
    }
  });

  socket.on('privateMessage', async ({ senderEmail, receiverEmail, message }) => {
    if (!senderEmail || !receiverEmail) {
      console.error('Failed to save message: senderEmail and receiverEmail are required');
      return;
    }

    const newMessage = new Chat({ sender: senderEmail, receiver: receiverEmail, message });

    try {
      await newMessage.save();
      io.to(receiverEmail).emit('receiveMessage', { senderEmail, receiverEmail, message });
      console.log(`Message from ${senderEmail} to ${receiverEmail}: ${message}`);
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  });

  socket.on('send-message', (message) => {
    const { room, content, sender } = message;
    if (room && content && sender) {
      io.to(room).emit('receive-message', message);
      console.log(`Message from ${sender} to room ${room}: ${content}`);
    } else {
      console.error('Message data is incomplete.');
    }
  });

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
app.use('/api/teams', teamRoutes);

// Endpoint to receive and log frontend logs
app.post('/log', (req, res) => {
  const { level = 'info', message } = req.body;

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
