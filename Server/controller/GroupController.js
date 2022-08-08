const Conversation = require("../models/conversation");
const Group = require('../models/group');


class GroupController {

    static async getGroupList(req, res, next) {
        
    }

    static async getGroupDetails(req, res, next) {

    }

    static async createGroup(req, res, next) {
        try {

            const newGroup = new Group({
                group_name: req.body.groupName,
                group_profile_picture_url: req.body.groupProfilePicture,
                group_members: req.body.members
            });
            newGroup.save().then(data => {
                console.log(data);
            });

            const newConversation = new Conversation({
                is_group: true,
                group_id: newGroup._id,
                members: req.body.members
            });
            newConversation.save().then(data => {
                console.log(data);
            });

            res.status(200).json({
                result: 'success',
                msg: 'new Group created'
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }

    static async addGroupMember(req, res, next) {
        
    }
}

module.exports = GroupController