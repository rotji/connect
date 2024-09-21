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
const User = require('./models/User'); // Added User model

// Import multer for handling file uploads
const multer = require('multer');

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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
}));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const dbUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/futurefriends';
mongoose.set('strictQuery', false);
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true // Ensure indexes are created
})
.then(() => console.log(`Connected to MongoDB at ${dbUri}`))
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/')); // Store files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Append unique ID to the file
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
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

  const profilePicUrl = `/uploads/${req.file.filename}`; // URL of the uploaded image
  const userEmail = req.body.email; // Using email as identifier

  // Update the user's profile picture in the database
  User.findOneAndUpdate({ email: userEmail }, { profilePic: profilePicUrl }, { new: true }, (err, updatedUser) => {
    if (err) return res.status(500).json({ error: 'Error updating profile picture' });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  });
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
      io.to(receiverId).emit('receiveMessage', { senderId, receiverId, message });
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
app.use('/api/teams', teamRoutes);

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
