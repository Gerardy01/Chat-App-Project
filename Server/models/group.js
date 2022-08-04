const mongoose = require('mongoose');



const Group = mongoose.model('group', new mongoose.Schema({
    group_name: {
        type: Boolean,
        required: true
    },
    group_profile_picture_url: {
        type: String
    }
}, { timestamps: true }));

module.exports = Group;