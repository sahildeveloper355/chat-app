const express = require('express')
const app = express()
const port = 5000
const userRoute = require('./routes/user-route')
const messageRoute = require('./routes/message-route')
const chatRoute = require('./routes/chat-route')
const cors=require('cors')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/user', userRoute)
app.use('/chat', chatRoute)
app.use('/message', messageRoute)

const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}
startServer(port)
module.exports = { startServer, app }
