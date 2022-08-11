const mongoose = require('mongoose');



const Group = mongoose.model('group', new mongoose.Schema({
    group_name: {
        type: String,
        required: true
    },
    group_profile_picture_url: {
        type: String
    },
    group_members: {
        type: Array,
        required: true
    }
}, { timestamps: true }));

module.exports = Group;