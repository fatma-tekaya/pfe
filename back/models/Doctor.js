const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User'); // Correction de l'importation du modèle `User`

const doctorSchema = new Schema({
  specialty: {
    type: String,
    
  },
  address: {
    type: String,
    
  },
  phoneNumber: {
    type: String,
    
  },
  officeHours: {
    type: String,
    
  },
  consultationFee: {
    type: Number,
    
  },
  rating: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    default: '',
  }
});

const Doctor = User.discriminator('Doctor', doctorSchema);

module.exports = Doctor;
