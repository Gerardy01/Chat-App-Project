const mongoose = require('mongoose');



const Message = mongoose.model('message', new mongoose.Schema({
    source_id: {
        type: String,
        required: true
    },
    sender_id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true }));

module.exports = Message;