const express = require('express');
require('dotenv').config();
require('./config/db');
const userRouter = require('./routes/user');

const User = require('./models/User');

const app = express();

// app.use((req, res, next) => {
//   req.on('data', chunk => {
//     const data = JSON.parse(chunk);
//     req.body = data;
//     next();
//   });
// });

app.use(express.json());
app.use(userRouter);

// const test = async (email, password) => {
//   const user = await User.findOne({ email: email });
//   const result = await user.comparePassword(password);
//   console.log(result);
// };

// test('niraj@email.com', 'niraj12');

app.get('/test', (req, res) => {
  res.send('Hello world');
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to backend zone!' });
});

app.listen(5000, () => {
  console.log('port is listening');
});


//mongodb
// require('./config/db');

// const app = require('express')();
// const port = process.env.PORT || 5000;
// const bodyParser = require('body-parser');

// //cors 
// const cors = require("cors");
// app.use(cors());

// const UserRouter= require('./api/User');

// //for accepting post form data
// app.use(bodyParser.json());

// app.use('/user', UserRouter)

// app.listen(port, ()=>{
//     console.log(`Server running on port ${port}`);
// })