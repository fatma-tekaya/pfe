const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User'); // Correction de l'importation du modèle `User`

const captureSchema = new Schema({
  path: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

const patientSchema = new Schema({
  googleToken: {
    type: String,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  verifUserCode: {
    type: Number,
  },
  verificationCode: {
    type: Number,
  },
  avatar: {
    type: String,
    default: null,
  },
  appRating: {
    type: Number,
    default: null,  
    min: 1,         
    max: 5          
  },
  captures: [captureSchema],
  conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
  birthdate: {
    type: Date,
  },
  location: {
    type: String,
  },
  gender: {
    type: String,
  },
  height: {
    type: Number,
   
  },
  weight: {
    type: Number,
   
  },
  medicalHistory: {
    type: String,
    default: null,
  },
  allergies: {
    type: [String],
    default: [],
  },
  currentMedications: {
    type: [String],
    default: [],
  },
  emergencyContact: {
    type: String,
    default: null,
  },
  FCMtoken: {
    type: String,
    default: null
  },
  chronicConditions: {
    type: [String],
    default: [],
  }
});

const Patient = User.discriminator('Patient', patientSchema);

module.exports = Patient;
