const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
 birthdate:{
  type : Date,
 },
 location:{
  type:String,
 },
 gender:{
  type:String,
 },
 height:{
  type:Number,
 },
 weight:{
  type:Number,
 },
 googleToken: {
  type: String,
  default: null,
},
verifUserCode : {
  type: String,
},
  verificationCode: {
    type: String,
  },
  avatar: String,
  captures: [{ type: String }],
  tokens: [{ type: Object }],
 
});
//userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
module.exports = mongoose.model('User', userSchema);