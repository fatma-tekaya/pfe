const http = require('http');
const express = require('express');
//const socketIO = require('socket.io');
require('dotenv').config();
require('./config/db');
const { Server } = require('socket.io');
//const chatSocket = require('./src/socekts/chatSocket');
const app = express();
const errorHandler = require('./middelwares/errorHandler');
const cors = require('cors');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  // Recevoir les données de l'utilisateur
  socket.on('user-data', (data) => {
    console.log('User data received:', data);

    // Envoyer une réponse au client spécifique
    socket.emit('server-response', { message: 'Data received' });
  });

  // Envoyer un message à tous les clients connectés
  io.emit('broadcast-message', { message: 'A new user has connected' });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});
const userRouter = require('./routes/user');
app.use(cors());
app.use(express.json());
app.use(userRouter);
//app.use(errorHandler);
//chatSocket(io)

app.listen(5000, () => {
  console.log('port is listening');
},);

