const express = require('express');
require('dotenv').config();
require('./config/db');
//const errorHandler =require('./middelwares/errorHandler');
const cors = require('cors');


const userRouter = require('./routes/user');
const chatRouter = require('./routes/conversation')

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);
//app.use(errorHandler);
app.use(chatRouter);





app.listen(5000, () => {
  console.log('port is listening');
});



