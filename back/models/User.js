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
  //  isEmailConfirmed: {
  //    type: Boolean,
  //    default: false, // Par défaut, l'e-mail n'est pas confirmé
  //  },
  verificationCode: {
    type: String,
  },
  avatar: String,
  captures: [{ type: String }],
  tokens: [{ type: Object }],
});

module.exports = mongoose.model('User', userSchema);
