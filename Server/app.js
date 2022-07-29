const express = require('express');
const app = express();
const cors = require('cors');

const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());



// MongoDB Connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat_app');

mongoose.connection.on('connected', () => console.log('connected to the database'));



// API Routes Connection
const apiRoutes = require('./routes')
app.use('/api', apiRoutes);



// run server
app.listen(PORT, () => console.log(`server runs at port ${PORT}`));