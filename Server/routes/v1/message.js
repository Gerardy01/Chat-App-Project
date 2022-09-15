const express = require('express');
const message = express();

const MessageController = require('../../controller/MessageController');



message.get('/:sourceId', MessageController.getMessage);
message.post('/', MessageController.addMessage);
message.put('/edit', MessageController.editMessage);
message.delete('/delete', MessageController.deleteMessage);



module.exports = message;