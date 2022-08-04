const express = require('express');
const chat = express();

const ChatController = require('../../controller/ChatController');

const privateMessage = require('./privateMessage');



chat.get('/conversation/:userId', ChatController.getConversation);

chat.post('/add-conversation-member/:userId', ChatController.addConversationMember);



chat.use('/private-message', privateMessage);



module.exports = chat