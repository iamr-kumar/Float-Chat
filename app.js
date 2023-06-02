const express = require('express');
require('dotenv').config();
const app = express();
const connectDb = require('./config/db');
const socket = require('socket.io');
const session = require('express-session');
const flash = require('connect-flash');
const {
  addUser,
  removeUser,
  findConnectedUser,
  loadChatHistory,
} = require('./utils/roomAction');
const { loadMessages, sendMessage } = require('./utils/messageAction');

// Connect to db
connectDb();

// Bring in routes
const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');

// Middleware setup
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(
  session({
    secret: 'sessi0nS3cr3t',
    saveUninitialized: true,
    resave: false,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});

app.set('view engine', 'ejs');

// Global variable to store active users
global.users = [];

// Use express router
app.use(userRoutes);
app.use(indexRoutes);

const port = process.env.PORT || '3000';

const server = app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

// Initialize socket
const io = socket(server);

// Make sure that a user exists before making a connection
io.use((socket, next) => {
  if (socket.handshake.query.username) {
    return next();
  }
  return next(new Error('Authentication error!'));
});

// Establish connection
io.on('connection', (socket) => {
  const username = socket.handshake.query.username;

  socket.on('join', async ({ userId }) => {
    const users = await addUser(userId, socket.id);

    const { chats, err } = await loadChatHistory(userId);
    if (chats) {
      io.emit('loadChatHistory', { chats });
    } else {
      console.log(err);
      io.emit('errorLoadingChatHistory', { err });
    }
    setInterval(() => {
      io.emit('connectedUsers', {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 3000);
  });

  socket.on('loadMessages', async ({ userId, messageWith }) => {
    const { chats, user } = await loadMessages(userId, messageWith);
    if (!user) {
      socket.emit('messagesLoaded', { chats });
    } else {
      console.log(user);
      socket.emit('noChatFound', { user });
    }
  });

  socket.on('sendMessage', async ({ userId, messageTo, text }) => {
    const { error, newMessage } = await sendMessage(userId, messageTo, text);
    const receiverSocket = findConnectedUser(messageTo);

    if (receiverSocket) {
      io.to(receiverSocket.socketId).emit('newMessage', {
        newMessage,
        userId,
      });
    }
    if (!error) {
      socket.emit('messageSent', { newMessage });
    }
  });

  socket.on('disconnect', async () => {
    await removeUser(username);
    socket.broadcast.emit('removeUser', {
      id: socket.id,
      name: username,
    });
  });

  socket.broadcast.emit('newUser', {
    id: socket.id,
    name: username,
  });
});
