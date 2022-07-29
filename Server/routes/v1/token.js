const express = require('express');
const token = express();

const TokenController = require('../../controller/TokenController');

const verifyToken = require('../../middleware/verifyToken');



token.get('/', verifyToken, TokenController.getNewToken);






module.exports = token