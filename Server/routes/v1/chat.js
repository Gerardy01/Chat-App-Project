const express = require('express');
const chat = express();

const ChatController = require('../../controller/ChatController');

const privateMessage = require('./privateMessage');
const message = require('./message');



chat.get('/conversation/:userId', ChatController.getConversation);
chat.put('/conversation/add-member', ChatController.addConversationMember);
chat.delete('/conversation/remove-member', ChatController.removeConversationMember);



chat.use('/private-message', privateMessage);
chat.use('/message', message);



module.exports = chat;