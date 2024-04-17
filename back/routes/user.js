const express = require('express');
const router = express.Router();
const { createUser, userSignIn, uploadProfile, signOut,signInWithGoogle, uploadPicture,forgotPassword,resetPassword } = require('../controllers/user');
const { isAuth } = require('../middelwares/auth');
const { validateUserSignUp, userVlidation, validateUserSignIn } = require('../middelwares/validation/user');
const { confirmEmailAndRegisterUser } = require('../controllers/user');
const multer = require('multer');

// Define multer storage configuration
const storage = multer.diskStorage({});

// Define multer file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Invalid image file!', false);
  }
};

// Create multer instance with defined storage and file filter
const uploads = multer({ storage, fileFilter });


router.post('/create-user', validateUserSignUp, createUser);
router.get('/confirm-email/:token', confirmEmailAndRegisterUser);
router.post('/sign-in', validateUserSignIn, userVlidation, userSignIn);
router.post('/sign-out', isAuth, signOut);
router.post('/google-signin', signInWithGoogle);
// Route for uploading profile picture
router.put('/upload-profile', isAuth, uploads.single('profile'), uploadProfile);

// Route for uploading additional pictures
router.put('/upload-picture', isAuth, uploads.single('picture'), uploadPicture);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
module.exports = router;
