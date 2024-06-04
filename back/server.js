const express = require('express');
require('dotenv').config();
const path = require('path');
require('./config/db');
//const errorHandler =require('./middelwares/errorHandler');
const cors = require('cors');


const userRouter = require('./routes/user');
const chatRouter = require('./routes/conversation');
const skinRouter = require('./routes/skin');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(userRouter);
//app.use(errorHandler);
app.use(chatRouter);
app.use(skinRouter)





app.listen(5000, () => {
  console.log('port is listening');
});



