const express = require('express');
const v1 = express();

const user = require('./user');
const token = require('./token');
const chat = require('./chat');
const group = require('./group');



v1.get('/', (req, res) => {
    res.status(200).json({
        msg: 'api v1 routes'
    });
});

v1.use('/users', user);
v1.use('/token', token);
v1.use('/chat', chat);
v1.use('/group', group);



module.exports = v1;