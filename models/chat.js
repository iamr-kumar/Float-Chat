const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chats: [
    {
      messageWith: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      messages: [
        {
          msg: { type: String, required: true },
          sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          date: { type: Date, default: Date.now },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("chat", ChatSchema);
