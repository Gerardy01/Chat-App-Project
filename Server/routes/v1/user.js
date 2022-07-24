const express = require('express');
const user = express();

const UserController = require('../../controller/UserController')



user.post('/register', UserController.registerUser);



module.exports = user