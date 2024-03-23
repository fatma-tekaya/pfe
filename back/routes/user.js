const express = require('express');

const router = express.Router();
const {
  createUser,
  userSignIn,
  uploadProfile,
  signOut,
} = require('../controllers/user');
const { isAuth } = require('../middelwares/auth');
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require('../middelwares/validation/user');
const { confirmEmailAndRegisterUser } = require('../controllers/user');

const multer = require('multer');

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('invalid image file!', false);
  }
};
const uploads = multer({ storage, fileFilter });

//router.post('/create-user', validateUserSignUp, userVlidation, createUser);
router.post('/create-user', validateUserSignUp, createUser);
router.get('/confirm-email/:token',confirmEmailAndRegisterUser);
router.post('/sign-in', validateUserSignIn, userVlidation, userSignIn);
router.post('/sign-out', isAuth, signOut);
router.put(
  '/upload-profile',
  isAuth,
  uploads.single('profile'),
  uploadProfile
);

module.exports = router;