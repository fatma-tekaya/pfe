const http = require('http');
const express = require('express');
const { startListening } = require('./controllers/notifSignVitaux');
require('dotenv').config();
const path = require('path');
require('./config/db');
//const errorHandler =require('./middelwares/errorHandler');
const cors = require('cors');


const userRouter = require('./routes/user');
const chatRouter = require('./routes/conversation');
const skinRouter = require('./routes/skin');
const adminRouter =require('./routes/admin');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(userRouter);
//app.use(errorHandler);
app.use(chatRouter);
app.use(skinRouter)
app.use(adminRouter)


// const bcrypt = require('bcrypt');
// bcrypt.hash('admin123456', 10, function(err, hash) {
//   console.log(hash); // Affiche le mot de passe haché
// });

app.listen(5000, () => {
  console.log('port is listening');
  startListening(); 
},);

