const Conversation = require("../models/conversation")



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
                        isGroup: e.is_group,
                        groupId: e.group_id
                    });
                }

                const displayedUser = e.members.find(data => data !== req.params.userId);

                if (!e.is_group && displayedUser) {
                    data.push({
                        isGroup: e.is_group,
                        privateMessageId: e.private_message_id,
                        displayedUserId: displayedUser
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
        
    }
}

module.exports = ChatController