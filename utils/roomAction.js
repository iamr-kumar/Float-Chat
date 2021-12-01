const users = [];
const ChatModel = require("../models/chat");
const User = require("../models/users");

const addUser = async (userId, socketId) => {
  const user = users.find((user) => user.userId === userId);
  if (user && user.socketId === socketId) {
    return users;
  } else {
    if (user && user.socketId !== socketId) {
      await removeUser(socketId);
    }

    const newUser = { userId, socketId };
    users.push(newUser);
    return users;
  }
};

const removeUser = async (socketId) => {
  const indexOf = users.findIndex((user) => user.socketId === socketId);
  await users.splice(indexOf, 1);
  return;
};

const findConnectedUser = (userId) =>
  users.find((user) => user.userId === userId);

const loadChatHistory = async (userId) => {
  try {
    const currUser = await User.findOne({ username: userId });
    const chatsWith = await ChatModel.findOne({ user: currUser._id }).populate(
      "chats.messageWith"
    );

    return { chats: chatsWith.chats };
  } catch (err) {
    console.log(err);
    return { err };
  }
};

module.exports = { addUser, removeUser, findConnectedUser, loadChatHistory };
