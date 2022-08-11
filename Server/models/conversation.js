const mongoose = require('mongoose');



const Conversation = mongoose.model('Conversation', new mongoose.Schema({
    is_group: {
        type: Boolean,
        required: true
    },
    group_id: {
        type: String
    },
    private_message_id: {
        type: String
    },
    members: {
        type: Array
    }
}, { timestamps: true }));

module.exports = Conversation;