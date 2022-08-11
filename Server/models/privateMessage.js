const mongoose = require('mongoose');



const PrivateMessage = mongoose.model('privateMessage', new mongoose.Schema({
    members: {
        type: Array,
        required: true
    }
}, { timestamps: true }));

module.exports = PrivateMessage;