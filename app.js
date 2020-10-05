const express = require("express");
const app = express();
const connectDb = require("./config/db");
const socket = require("socket.io");
const session = require("express-session");

connectDb();

const userRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: "sessi0nS3cr3t",
    saveUninitialized: true,
    resave: false,
  })
);

app.set("view engine", "ejs");

global.users = [];

app.use(userRoutes);
app.use(indexRoutes);

const port = process.env.PORT || "3000";

const server = app.listen(port, () => {
  console.log(`Server started on ${port}`);
});


const io = socket(server);

io.use((socket, next) => {
  if(socket.handshake.query.username) {
    return next();
  }
  return next(new Error('Authentication error!'));
});

io.on("connection", (socket) => {
  // console.log("Made new connection");
  const token = socket.handshake.query.username;
  socket.on('disconnect', () => {
    const clientId = socket.id;
    users = users.filter(user => user.id !== clientId);
  });

  users.push({
    id: socket.id,
    name: token
  });

  socket.on('message', (data) => {
    const reciever = data.to;
    const recieverId = users.find(user => user.name === reciever);
    console.log(recieverId);
    io.to(recieverId.id).emit('message', data);
  });

  socket.broadcast.emit('newUser', {
    id: socket.id,
    name: token
  });

});
