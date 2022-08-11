const Message = require('../models/message');



class MessageController {
    static async getMessage(req, res, next) {
        try {

            const messages = await Message.find(
                { conversation_id: req.params.conversationId }
            )

            if (messages.length === 0) {
                return res.status(204).json({
                    result: 'success',
                    msg: 'no message'
                });
            }

            const data = [];

            messages.forEach(e => {
                data.push({
                    id: e._id,
                    senderId: e.sender_id,
                    text: e.text,
                    created: e.createdAt
                });
            });

            res.status(200).json({
                result: 'success',
                msg: 'get messages',
                data: data
            });
                
        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }

    static async addMessage(req, res, next) {
        try {

            const message = new Message({
                conversation_id: req.body.conversationId,
                sender_id: req.body.senderId,
                text: req.body.text
            });
            message.save().then(data => {
                console.log(data);
                res.status(200).json({
                    result: 'success',
                    msg: 'message added'
                });
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }

    static async editMessage(req, res, next) {
        try {
            
        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }

    static async deleteMessage(req, res, next) {
        try {

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }
}

module.exports = MessageController;