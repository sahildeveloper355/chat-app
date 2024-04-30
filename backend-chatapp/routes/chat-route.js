const express = require('express')
const router = express.Router()
const Chat = require('../models/chat-model')
const Message = require('../models/message-model')
const bodyParser = require('body-parser')

router.use(bodyParser.json())

router.post('/create/:id', async (req, res) => {
  const { message } = req.body;
  const senderId = req.params.id;
  const receiverId = req.body.receiverId;

  try {
    let chat = await Chat.findOne({ senderId, receiverId });

    if (chat) {
      if (!chat.messages) {
        chat.messages = {};
      }
      chat.messages= { message, senderId, receiverId };
      const updatedChat = await chat.save();
      res.json(updatedChat);
    } else {
      chat = new Chat({
        senderId,
        receiverId,
        messages: {},
      });
      chat.messages = { message, senderId, receiverId };
      const newChat = await chat.save();
      res.status(201).json(newChat);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
