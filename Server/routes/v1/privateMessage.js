const express = require('express');
const privateMessage = express();

const PrivateMessageController = require('../../controller/PrivateMessageController');



privateMessage.get('/:id', PrivateMessageController.getPrivateMessage);

privateMessage.post('/', PrivateMessageController.createPrivateMessage);



module.exports = privateMessage