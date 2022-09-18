const Conversation = require("../models/conversation");
const Group = require('../models/group');
const User = require('../models/User');


class GroupController {

    static async getGroupList(req, res, next) {
        
    }

    static async getGroupDetails(req, res, next) {
        try {

            const group = await Group.findOne(
                { _id: req.params.groupId }
            ).catch(err => {
                return false;
            });

            if (!group) {
                return res.status(200).json({
                    result: 'success',
                    msg: 'no groups found'
                });
            }

            const data = {
                id: group._id,
                groupName: group.group_name,
                groupProfilePict: group.group_profile_picture_url,
                members: group.group_members
            }

            res.status(201).json({
                result: 'success',
                data: data
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
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
                members: req.body.members,
                latest_text: ""
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

        try {

            const user = await User.findOne(
                { _id: req.body.userId }
            );



            const group = await Group.findOne(
                { _id: req.body.groupId }
            );

            const memberIsAvail = group.group_members.find(e => e === req.body.userId);

            if (memberIsAvail) {
                return res.status(403).json({
                    result: 'failed',
                    msg: 'user already member of this group'
                });
            }

            const newGroupMember = group.group_members;
            newGroupMember.push(req.body.userId);
            
            await Group.findByIdAndUpdate(
                { _id: req.body.groupId },
                { group_members: newGroupMember }
            ).then(data => {
                console.log(data);
            });
            
            await Conversation.findOneAndUpdate(
                { group_id: req.body.groupId },
                { members: newGroupMember }
            ).then(data => {
                console.log(data);
            });

            res.status(200).json({
                result: 'success',
                msg: 'new member added'
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }

        
    }
}

module.exports = GroupController