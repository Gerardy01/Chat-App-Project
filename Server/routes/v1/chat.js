const express = require('express');
const chat = express();

const ChatController = require('../../controller/ChatController');



chat.get('/conversation', ChatController.getConversation);

chat.post('/conversation', ChatController.createConversation);
chat.post('/add-member', ChatController.addMember);






module.exports = chat