const express = require('express');
const user = express();

const UserController = require('../../controller/UserController')



user.post('/register', UserController.registerUser);
user.post('/login', UserController.login);



module.exports = user