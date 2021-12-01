const ChatModel = require("../models/chat");
const User = require("../models/users");

const loadMessages = async (userId, messageWith) => {
  try {
    const sender = await User.findOne({ username: userId }).select("-password");
    const receiver = await User.findOne({ username: messageWith }).select(
      "-password"
    );
    const userChats = await ChatModel.findOne({ user: sender._id }).populate(
      "chats.messageWith"
    );

    const chats = userChats.chats.find(
      (chat) => chat.messageWith._id.toString() === receiver._id.toString()
    );

    if (!chats) {
      return { user: receiver };
    }
    return { chats };
  } catch (err) {
    console.log(err);
    return { err };
  }
};

const sendMessage = async (userId, messageWith, message) => {
  try {
    const sender = await User.findOne({ username: userId }).select("-password");
    const receiver = await User.findOne({ username: messageWith }).select(
      "-password"
    );
    const user = await ChatModel.findOne({ user: sender._id });
    if (!user) {
      return { error: "User not found" };
    }
    const messageToUser = await ChatModel.findOne({ user: receiver._id });
    if (!messageToUser) {
      return { error: "User not found" };
    }
    const newMessage = {
      msg: message,
      sender: sender._id,
      receiver: receiver._id,
      date: Date.now(),
    };

    const prevChat = user.chats.find(
      (chat) => chat.messageWith.toString() === receiver._id.toString()
    );
    if (prevChat) {
      prevChat.messages.push(newMessage);
      await user.save();
    } else {
      const newChat = {
        messageWith: receiver._id,
        messages: [newMessage],
      };
      user.chats.unshift(newChat);
      await user.save();
    }

    const prevChatForRec = messageToUser.chats.find(
      (chat) => chat.messageWith.toString() === sender._id.toString()
    );
    if (prevChatForRec) {
      prevChatForRec.messages.push(newMessage);
      await messageToUser.save();
    } else {
      const newChat = {
        messageWith: sender._id,
        messages: [newMessage],
      };
      messageToUser.chats.unshift(newChat);
      await messageToUser.save();
    }
    return { newMessage };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

module.exports = { loadMessages, sendMessage };
