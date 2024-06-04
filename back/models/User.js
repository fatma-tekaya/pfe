// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;


// // Définir le sous-schéma pour les captures
// const captureSchema = new Schema({
//   path: {
//       type: String,
//       required: true
//   },
//   label: {
//       type: String,
//       required: true
//   }
// });

// const userSchema = new mongoose.Schema({
//   fullname: {
//     type: String,
//     required: true,
//   },
//   refreshToken: {
//     type: String,
//     default: null,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//   },
//  birthdate:{
//   type : Date,
//  },
//  location:{
//   type:String,
//  },
//  gender:{
//   type:String,
//  },
//  height:{
//   type:Number,
//  },
//  weight:{
//   type:Number,
//  },
//  googleToken: {
//   type: String,
//   default: null,
// },
// verified:{
//   type:Boolean,
//   default:false,
// },
// verifUserCode : {
//   type: Number,
// },
// verificationCode: {
//     type: Number,
//   },
//   avatar: {
//     type: String,
//     default: null,
//   },
//   captures: [captureSchema], 
//   conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],

//  roles:{
//   type:[String],
//   enum:["user","admin","doctor"],
//   default:["user"],
//  }
 
// });
// //userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définir le sous-schéma pour les captures
const captureSchema = new Schema({
  path: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
});

// Schéma de base pour les utilisateurs
const userSchema = new Schema({
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
    required: true,
  },
  roles: {
    type: [String],
    enum: ["user", "admin", "doctor", "patient"],
    default: ["user"],
  }
}, { discriminatorKey: 'userType', collection: 'users' });

const User = mongoose.model('User', userSchema);

module.exports = User;
