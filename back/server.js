const http = require('http');
const express = require('express');
const { startListening } = require('./sockets/notifSignVitaux');
 require('dotenv').config();
require('./config/db');

const { Server } = require('socket.io');
//const chatSocket = require('./src/socekts/chatSocket');
const app = express();
const errorHandler = require('./middelwares/errorHandler');
const cors = require('cors');



const userRouter = require('./routes/user');
app.use(cors());
app.use(express.json());
app.use(userRouter);
//app.use(errorHandler);
//chatSocket(io)
//cronJob.checkVitalSignsAndNotify();
app.listen(5000, () => {
  console.log('port is listening');
  startListening(); 
},);

