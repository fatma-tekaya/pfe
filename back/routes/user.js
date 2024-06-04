const express = require("express");
const router = express.Router();
const {
  createUser,
  userSignIn,
  uploadProfile,
  signOut,
  signInWithGoogle,
  uploadPicture,
  forgotPassword,
  resetPassword,
  confirmEmailAndRegisterUser,
  refresh
} = require("../controllers/user");
const { isAuth } = require("../middelwares/auth");
const {
  validateUserSignUp,
  userVlidation,
  validateUserSignIn,
} = require("../middelwares/validation/user");
const checkRole = require('../middelwares/role');
const multer = require("multer");

// Define multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Répertoire temporaire pour stocker les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nommer le fichier de manière unique
  },
});

// Define multer file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid image file!", false);
  }
};

// Create multer instance with defined storage and file filter
const uploads = multer({ storage, fileFilter });

router.post("/create-user", validateUserSignUp,userVlidation, createUser);
router.post("/verify-email", confirmEmailAndRegisterUser);
router.post("/sign-in", validateUserSignIn, userVlidation, userSignIn);
router.post("/refresh" ,isAuth, refresh)
//router.post("/sign-out", isAuth, signOut);
router.post("/google-signin", signInWithGoogle);
router.put("/upload-profile", isAuth,checkRole('patient'), uploads.single("profile"), uploadProfile);
router.put("/upload-picture", isAuth,checkRole('patient'), uploads.single("picture"), uploadPicture);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
