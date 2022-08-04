const express = require('express');
const privateMessage = express();

const PrivateMessageController = require('../../controller/PrivateMessageController');



privateMessage.post('/', PrivateMessageController.createPrivateMessage);



module.exports = privateMessage