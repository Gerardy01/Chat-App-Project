const express = require('express');
const user = express();

const UserController = require('../../controller/UserController');
const verifyToken = require('../../middleware/verifyToken');



user.post('/register', UserController.registerUser);
user.post('/login', UserController.login);

user.put('/change-name', verifyToken, UserController.changeName);
user.put('/change-username', verifyToken, UserController.changeUsername);
user.put('/change-email', verifyToken, UserController.changeEmail);
user.put('/change-password', verifyToken, UserController.changePassword);



module.exports = user