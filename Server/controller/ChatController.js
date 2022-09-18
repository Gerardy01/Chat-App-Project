const Conversation = require("../models/conversation");
const PrivateMessage = require("../models/privateMessage");



class ChatController {

    static async getConversation(req, res, next) {
        try {

            let data = [];
            const conversations = await Conversation.find(
                { members: { $in : [req.params.userId] } }
            );

            if (conversations.length === 0) {
                return res.status(404).json({
                    result: 'failed',
                    msg: 'user data not found'
                })
            }

            conversations.forEach(e => {
                if (e.is_group) {
                    data.push({
                        conversationId: e.id,
                        isGroup: e.is_group,
                        groupId: e.group_id,
                        latestText: e.latest_text,
                        updated: e.updatedAt
                    });
                }

                const displayedUser = e.members.find(data => data !== req.params.userId);

                if (!e.is_group && displayedUser) {
                    data.push({
                        conversationId: e.id,
                        isGroup: e.is_group,
                        privateMessageId: e.private_message_id,
                        displayedUserId: displayedUser,
                        latestText: e.latest_text,
                        updated: e.updatedAt
                    })
                }
            });

            res.status(200).json({
                result: 'success',
                data: data
            })

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }

    static async addConversationMember(req, res, next) {
        try {

            const conversation = await Conversation.findOne(
                { _id: req.body.conversationId }
            );

            const userExist = conversation.members.find(e => e === req.body.userId);
            if (userExist) {
                return res.status(403).json({
                    result: 'failed',
                    msg: 'user already member of this conversation'
                })
            }



            const privateMessage = await PrivateMessage.findOne(
                { _id: conversation.private_message_id }
            );
            
            const userAuth = privateMessage.members.find(e => e === req.body.userId);
            if (!userAuth) {
                return res.status(400).json({
                    result: 'failed',
                    msg: 'user not a member of this private message'
                });
            }

            const conversationMember = conversation.members;
            conversationMember.push(req.body.userId);

            await Conversation.findByIdAndUpdate(
                { _id: req.body.conversationId },
                { members: conversationMember }
            )

            res.status(200).json({
                result: 'success',
                msg: 'user added'
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }

    static async removeConversationMember(req, res, next) {
        try {

            const conversation = await Conversation.findOne(
                { _id: req.body.conversationId }
            );

            const userExist = conversation.members.find(e => e === req.body.userId);
            if (!userExist) {
                return res.status(403).json({
                    result: 'failed',
                    msg: 'user not in this conversation'
                })
            }

            const conversationMember = [];

            conversation.members.forEach(data => {
                if (data !== req.body.userId) {
                    conversationMember.push(data);
                }
            });
            console.log(conversationMember);

            await Conversation.findByIdAndUpdate(
                { _id: req.body.conversationId },
                { members: conversationMember }
            )

            res.status(200).json({
                result: 'success',
                msg: 'user removed'
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }
}

module.exports = ChatController