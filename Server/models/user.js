const mongoose = require('mongoose');



const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birth: {
        type: String
    },
    profile_picture_url: {
        type: String
    }
}, { timestamps: true }));

module.exports = User;