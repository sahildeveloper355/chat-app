const mongoose = require('mongoose')
const User = require('./user-model')

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
    },
    file: {
      filename: {
        type: String,
        required: false,
      },
      filetype: {
        type: String,
        required: false,
      },
      fileurl: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
)

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message
