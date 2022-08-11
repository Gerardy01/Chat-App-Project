const express = require('express');
const apiRoutes = express();

const v1Routes = require('./v1');



apiRoutes.get('/', (req, res) => {
    res.status(200).json({
        msg: 'api routes'
    });
});

apiRoutes.use('/v1', v1Routes);



module.exports = apiRoutes;