const express = require('express');
const user = express();

const UserController = require('../../controller/UserController');
const verifyToken = require('../../middleware/verifyToken');



user.post('/register', UserController.registerUser);
user.post('/login', UserController.login);



module.exports = user