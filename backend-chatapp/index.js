const connectionToDB = require('./config/db')
const { startServer, app } = require('./server')
const setupSocketIO = require('./socket')

//Route
const userRoute = require('./routes/user-route')
const chatRoute = require('./routes/chat-route')
const messageRoute = require('./routes/message-route')
