const express = require('express');
const chat = express();

const ChatController = require('../../controller/ChatController');

const privateMessage = require('./privateMessage');



chat.get('/conversation/:userId', ChatController.getConversation);

chat.put('/conversation/add-member', ChatController.addConversationMember);

chat.delete('/conversation/remove-member', ChatController.removeConversationMember);



chat.use('/private-message', privateMessage);



module.exports = chat