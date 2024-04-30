const express = require('express')
const multer = require('multer')
const path = require('path')
const Message = require('../models/message-model')

const router = express.Router()

router.use(express.json())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        '.' +
        file.originalname.split('.').pop()
    )
  },
})
const upload = multer({ storage: storage })
// MUlter

router.post('/send', upload.single('content'), async (req, res) => {

  let file = null
  const { sender, receiver } = req.body

  try {
    // let oldMessages = await Message.find({
    //   $or: [
    //     { sender, receiver },
    //     { sender: receiver, receiver: sender },
    //   ],
    // });
    // console.log('Old Messages:', oldMessages);

    if (req.file) {
      file = {
        filename: req.file.originalname,
        filetype: req.file.mimetype,
        fileurl: req.file.path,
      }
    }

    const newMessage = new Message({
      sender,
      receiver,
      content: req.body.content || '',
      file,
    })
    console.log('New Message:', newMessage)

    const savedMessage = await newMessage.save()
    // oldMessages.push(savedMessage);
    res.status(201).json({ messages: savedMessage })
  } catch (error) {
    console.error('Error:', error)
    res.status(400).json({ message: error.message })
  }
})

router.get('/receiver/:id', async (req, res) => {
  try {
    const receiverId = req.params.id
    const receiverMessages = await Message.find({ receiver: receiverId })

    res.status(200).json(receiverMessages)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
