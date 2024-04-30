const mongoose = require("mongoose");
const User = require("./user-model");
const Message = require("./message-model");

const chatSchema = new mongoose.Schema({
  messages: {
    message: {
      type: String,
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
