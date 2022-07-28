const express = require('express');
const v1 = express();

const user = require('./user');
const token = require('./token');



v1.get('/', (req, res) => {
    res.status(200).json({
        msg: 'api v1 routes'
    });
});

v1.use('/users', user);
v1.use('/token', token);



module.exports = v1;