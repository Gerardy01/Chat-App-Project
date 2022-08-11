const express = require('express');
const group = express();

const GroupController = require('../../controller/GroupController');



group.get('/:groupId', GroupController.getGroupDetails);

group.post('/', GroupController.createGroup);

group.put('/', GroupController.addGroupMember);


module.exports = group