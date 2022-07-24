const express = require('express');
const v1 = express();

const user = require('./user');



v1.get('/', (req, res) => {
    res.status(200).json({
        msg: 'api v1 routes'
    });
});

v1.use('/users', user);



module.exports = v1;