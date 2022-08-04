const express = require('express');
const group = express();

const GroupController = require('../../controller/GroupController');



group.get('/', GroupController.getGroupDetails);

group.post('/', GroupController.createGroup);


module.exports = group