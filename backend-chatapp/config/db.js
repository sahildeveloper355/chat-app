const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/chat-app';

function connectToDB() {
    return mongoose.connect(url)
        .then(() => {
            console.log("Connected successfully to MongoDB");
        })
        .catch(error => {
            console.error("An error occurred while connecting to MongoDB:", error);
        });
}

connectToDB();

module.exports = { connectToDB };