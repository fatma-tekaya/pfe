const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null,
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
verified:{
  type:Boolean,
  default:false,
},
verifUserCode : {
  type: Number,
},
verificationCode: {
    type: Number,
  },
  avatar: {
    type: String,
    default: null,
  },
  captures: [{ type: String }],
  conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],

//  roles:{
//   type:[String],
//   enum:["user","admin","doctor"],
//   default:["user"],
//  }
 
});
//userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
module.exports = mongoose.model('User', userSchema);