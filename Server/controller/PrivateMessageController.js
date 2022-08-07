const PrivateMessage = require('../models/privateMessage');
const Conversation = require('../models/conversation');



class PrivateMessageController {
    static async createPrivateMessage(req, res, next) {
        try {

            const newPrivateMessage = new PrivateMessage({
                members: [req.body.senderId, req.body.reciverId]
            });
            newPrivateMessage.save().then(data => {
                console.log('new private message created');
            });

            const newConversation = new Conversation({
                is_group: false,
                private_message_id: newPrivateMessage._id,
                members: [req.body.senderId]
            });
            newConversation.save().then(data => {
                console.log('new conversation creatd');
            });

            res.status(200).json({
                result: 'success',
                msg: 'new private message created'
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }

    static async getPrivateMessage(req, res, next) {
        try {

            const privateMessage = await PrivateMessage.findOne(
                { _id: req.params.id }
            );

            res.status(200).json({
                id: privateMessage.id,
                members: privateMessage.members
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }
}

module.exports = PrivateMessageController