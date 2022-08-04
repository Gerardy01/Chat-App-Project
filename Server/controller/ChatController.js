const Conversation = require("../models/conversation")



class ChatController {
    static async createConversation(req, res, next) {
        try {

            if (req.body.members.length === 0) {
                return res.status(400).json({
                    result: 'failed',
                    msg: 'must be any member'
                });
            }

            const newConversation = new Conversation({
                is_group: false,
                members: req.body.members
            });
            newConversation.save().then(data => {
                console.log(data);
            });

            res.status(200).json({
                result: 'success',
                msg: 'new conversation created'
            });

        } catch(err) {
            res.status(500).json({
                result: 'failed',
                msg: err
            });
        }
    }

    static async getConversation(req, res, next) {

    }

    static async createGroup(req, res, next) {

    }

    static async addMember(req, res, next) {
        
    }
}

module.exports = ChatController