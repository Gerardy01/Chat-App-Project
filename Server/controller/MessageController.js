const Message = require('../models/message');
const PrivateMessage = require('../models/privateMessage');
const Group = require('../models/group');



class MessageController {
    static async getLatestMessage(req, res, next) {
        try {

            const message = await Message.find(
                { source_id: req.params.sourceId }
            ).limit(1).sort(
                { $natural: -1 }
            );
            
            if (message.length === 0) {
                return res.status(200).json({
                    result: 'success',
                    msg: 'no any message'
                });
            }

            const data = {
                id: message[0]._id,
                text: message[0].text,
                created: message[0].createdAt
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

    static async getMessage(req, res, next) {
        try {

            const messages = await Message.find(
                { source_id: req.params.sourceId }
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

            const privateMessage = await PrivateMessage.find(
                { _id: req.body.sourceId }
            )

            const group = await Group.find(
                { _id: req.body.sourceId }
            )

            if (privateMessage.length === 0 && group.length === 0) {
                return res.status(404).json({
                    result: 'failed',
                    msg: 'source not found'
                });
            }

            const message = new Message({
                source_id: req.body.sourceId,
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