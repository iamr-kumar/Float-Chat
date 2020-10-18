const express = require("express");
const app = express();
const connectDb = require("./config/db");
const socket = require("socket.io");
const session = require("express-session");

// Connect to db
connectDb();

// Bring in routes
const userRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");

// Middleware setup
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

// Global variable to store active users
global.users = [];

// Use express router
app.use(userRoutes);
app.use(indexRoutes);

const port = process.env.PORT || "3000";

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
    return next(new Error("Authentication error!"));
});

// Establish connection
io.on("connect", (socket) => {
    // console.log("Made new connection");
    const token = socket.handshake.query.username;
    // On disconnect, remove this user from active user's list
    socket.on("disconnect", () => {
        const clientId = socket.id;
        users = users.filter((user) => user.id !== clientId);
        //
    });

    // Add the user to active user's list
    users.push({
        id: socket.id,
        name: token,
    });
    // Get message data from client, find the reciever's socket id, and emit to that specific id
    socket.on("message", (data) => {
        const reciever = data.to;
        const recieverId = users.find((user) => user.name === reciever);
        // console.log(recieverId);
        io.to(recieverId.id).emit("message", data);
    });

    // Broadcast new user to all users except the current user
    socket.broadcast.emit("newUser", {
        id: socket.id,
        name: token,
    });
});
