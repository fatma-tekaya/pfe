const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient"); // Importer le modèle Patient
const { db } = require('../firebase/index');
const bcrypt = require("bcrypt");
const cloudinary = require("../helper/imageUpload");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
require('dotenv').config();

// Fonction pour envoyer un mail de confirmation de user
const sendVerificationCode = async (toEmail, verificationCode) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_SECRET,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: toEmail,
    subject: "Confirmation de votre inscription",
    text: `Merci de vous être inscrit sur notre plateforme. Votre code de vérification est : ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Code de vérification envoyé à", toEmail);
  } catch (error) {
    console.error("Erreur lors de l'envoi du code de vérification :", error);
  }
};


// Fonction de creation d'utilisateur
exports.createUser = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;


  // Vérification des erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("err", errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const existingUser = await Patient.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "This email is already in use, try sign-in",
      });
    }

    // Génération d'un code de vérification
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Envoi du code de vérification par e-mail
    await sendVerificationCode(email, verificationCode);

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);


    // Enregistrement de l'utilisateur dans la base de données avec verified = false
    const newUser = new Patient({
      fullname,
      email,
      password: hashedPassword, // Mot de passe haché
      verified: false,
      verificationCode, // Utilisation du nouveau nom du champ
      roles: ['patient'], // Assigner le rôle patient

    })



    // Create a corresponding entry in Firebase Realtime Database
    const userId = newUser._id.toString();
    const userRef = db.ref('patients').child(userId);

    await userRef.set({
      fullname,
      email,
      vitals: {
        temp: 0,
        heartRate: 0,
        spo2: 0
      }
    });
    await newUser.save();

    res.status(200).json({ success: true, message: `User created. Verification code sent to ${email}` });
  } catch (error) {
    console.error("Error while creating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fonction pour envoyer le code de vérification
exports.confirmEmailAndRegisterUser = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    // Recherche de l'utilisateur dans la base de données en utilisant le code de vérification
    const user = await Patient.findOne({ verificationCode });

    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.verified) {
      console.log("User already verified");
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    // Marquer l'utilisateur comme vérifié
    user.verified = true;

    // Enregistrement des modifications dans la base de données
    await user.save();
    console.log("User verified successfully");
    // Répondre avec un message de succès
    res
      .status(200)
      .json({ success: true, message: "User verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

exports.refresh = async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await Patient.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "No user found" });
    }

    // Vérifier si le refreshToken correspond à celui stocké dans la base de données
    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    const newToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Sauvegarder le nouveau refreshToken dans la base de données
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(403).json({ success: false, message: "Refresh token expired" });
    } else {
      console.error("Error while refreshing token:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};


// Contrôleur pour connecter un utilisateur
exports.userSignIn = async (req, res) => {
  const { email, password } = req.body; // Extraction des données du corps de la requête
  try {
    const user = await Patient.findOne({ email }); // Recherche de l'utilisateur dans la base de données
    if (!user) {
      console.log("User not found with the given email!");
      return res.json({
        success: false,
        message: "User not found with the given email!",
      });
    }
    if (!user.verified) {
      console.log("User is not verified Yet!");
      return res.json({
        success: false,
        message: "User is not verified Yet!",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password is incorrect!");
      return res.json({
        success: false,
        message: "Password is incorrect!",
      });
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    // Sauvegarde de l'utilisateur avec le nouveau token
    await user.save();
    console.log("user signed in successfully");
    res.json({
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        location: user.location,
        birthdate: user.birthdate,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        avatar: user.avatar ? user.avatar : "",
      },
      token,
      refreshToken,
    });

    
  } catch (error) {
    console.error("Error while signing in:", error);
    res.status(500).json({ success: false, message: "Internal server error" }); // Gestion des erreurs
  }
};

// exports.signInWithGoogle = async (req, res) => {
//   console.log("User here ", req.body.user);
//   const { email, name, photo, idToken, gender, birthdate, weight, height, location } = req.body.user;

//   try {
//     let user = await Patient.findOne({ email });
//     console.log("User found: ", user);

//     if (user) {
//       // Mise à jour de l'utilisateur existant avec les informations potentiellement nouvelles
//       user.fullname = name;
//       user.avatar = photo || user.avatar;
//       user.googleToken = idToken;
//       user.gender = gender || user.gender; // Mettre à jour seulement si fourni
//       user.birthdate = birthdate || user.birthdate;
//       user.weight = weight || user.weight;
//       user.height = height || user.height;
//       user.location = location || user.location;
//       user.authMethod = 'google'; 
//       await user.save();
//     } else {
//       // Création d'un nouvel utilisateur si non trouvé
//       user = new Patient({
//         fullname: name,
//         email,
//         avatar: photo || "",
//         verified: true,
//         authMethod: 'google',
//         googleToken: idToken,
//         gender: gender, // Ajoutez ces champs comme propriétés du nouvel utilisateur
//         birthdate: birthdate,
//         weight: weight,
//         height: height,
//         location: location,
//         roles: ['patient'], // Assigner le rôle patient
//       });
//       await user.save();
//     }
//       // Création de l'entrée dans Firebase Realtime Database
//       const userId = user._id.toString();
//       const userRef = db.ref('patients').child(userId);
//       await userRef.set({
//         fullname: name,
//         email,
//         vitals: {
//           temp: 0,
//           heartRate: 0,
//           spo2: 0
//         }
//       });
      
//     // Génération des tokens
//     const token = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     // Retour des informations de l'utilisateur et des tokens
//     console.log("User signed in successfully: ", user.fullname);
//     res.status(user ? 200 : 201).json({
//       success: true,
//       message: "User signed in successfully",
//       token,
//       refreshToken,
//       user: {
//         _id: user._id,
//         fullname: user.fullname,
//         email: user.email,
//         avatar: user.avatar,
//         verified: true,
//         gender: user.gender,
//         authMethod: 'google',
//         birthdate: user.birthdate,
//         weight: user.weight,
//         height: user.height,
//         location: user.location,
//       },
//     });
//   } catch (error) {
//     console.error("Error signing in with Google:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
// Fonction pour update user profile
exports.uploadProfile = async (req, res) => {
  const { user } = req; // Récupération de l'utilisateur depuis la requête
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "unauthorized access!" }); // Si l'utilisateur n'est pas authentifié, renvoyer un message d'erreur

  const { fullname, birthdate, location, gender, height, weight } = req.body;
  const avatar = req.file ? req.file.path : null; // Si une nouvelle image est fournie, utilisez-la, sinon, laissez-la nulle

  try {
    // Construction de l'objet de mise à jour en fonction des champs fournis
    const updateFields = {};
    if (fullname) updateFields.fullname = fullname;
    if (birthdate) updateFields.birthdate = birthdate;
    if (location) updateFields.location = location;
    if (gender) updateFields.gender = gender;
    if (height) updateFields.height = height;
    if (weight) updateFields.weight = weight;
    if (avatar) {
      // Upload de la nouvelle image vers Cloudinary
      const result = await cloudinary.uploader.upload(avatar, {
        public_id: `${user._id}_profile`,
        width: 500,
        height: 500,
        crop: "fill",
      });
      updateFields.avatar = result.url; // Mettre à jour l'avatar avec l'URL de l'image téléchargée
    }

    // Mise à jour de l'utilisateur dans la base de données si des champs à mettre à jour sont fournis
    if (Object.keys(updateFields).length > 0) {
      let updatedUser;

      // Si l'utilisateur n'est pas connecté avec Google, mettez simplement à jour son profil
      updatedUser = await Patient.findByIdAndUpdate(user._id, updateFields, {
        new: true,
      });


      console.log("updated Successfuly!");
      res.status(200).json({ success: true, user: updatedUser }); // Réponse indiquant le succès de la mise à jour du profil
    } else {
      console.log("No fields provided for update");
      res
        .status(400)
        .json({ success: false, message: "No fields provided for update" }); // Si aucun champ à mettre à jour n'est fourni dans la requête, renvoyer un message d'erreur
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "server error, try after some time" }); // En cas d'erreur lors de la mise à jour du profil, renvoyer un message d'erreur
    console.log("Error while updating profile", error.message); // Affichage de l'erreur dans la console
  }
};

exports.signInWithGoogle = async (req, res) => {
  const { email, name, photo, idToken, gender, birthdate, weight, height, location } = req.body.user;
  console.log("Google sign-in attempt for:", name);

  try {
    let user = await Patient.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Aucun utilisateur existant, en créer un nouveau
      user = new Patient({
        fullname: name,
        email,
        avatar: photo || "",
        verified: true, // Supposer que l'utilisateur Google est vérifié
        authMethod: 'google',
        googleToken: idToken,
        gender,
        birthdate,
        weight,
        height,
        location,
        roles: ['patient'],
      });
      isNewUser = true;
    } else {
      // Mise à jour des informations de l'utilisateur existant
      user.fullname = name;
      user.avatar = photo || user.avatar;
      user.googleToken = idToken;
      user.gender = gender || user.gender;
      user.birthdate = birthdate || user.birthdate;
      user.weight = weight || user.weight;
      user.height = height || user.height;
      user.location = location || user.location;
      user.authMethod = 'google';
    }

    await user.save(); // Sauvegarder une seule fois après toutes les modifications

    // Enregistrer dans Firebase si nécessaire
    if (isNewUser) {
      const userId = user._id.toString();
      const userRef = db.ref('patients').child(userId);
      await userRef.set({
        fullname: name,
        email,
        vitals: { temp: 0, heartRate: 0, spo2: 0 }
      });
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log("User signed in successfully with Google: ", user.fullname);
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      token,
      refreshToken,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
        verified: true,
        gender: user.gender,
        authMethod: 'google',
        birthdate: user.birthdate,
        weight: user.weight,
        height: user.height,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Error signing in with Google:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fonction for uploading additional pictures
exports.uploadPicture = async (req, res) => {
  const { user } = req; // Get the user from the request

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized access!" });
  }

  const picture = req.file ? req.file.path : null;
  const label = req.body.label; // Recevoir la prédiction du label

  try {
    if (picture) {
      // Ajouter le chemin de l'image et le label à l'utilisateur
      user.captures.push({ path: picture, label: label });
      await user.save();

      res.status(200).json({ success: true, message: "Picture and label saved successfully" });
    } else {
      res.status(400).json({ success: false, message: "No picture provided" });
    }
  } catch (error) {
    console.error("Error uploading picture and saving label:", error);
    res.status(500).json({ success: false, message: "Server error, try again later" });
  }
};


// Fonction pour générer un code de vérification aléatoire
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000); // Génère un nombre aléatoire à 6 chiffres
};

// Fonction pour envoyer l'e-mail de réinitialisation de mot de passe avec le code de vérification
const sendResetPasswordEmail = async (email, verifUserCode) => {
  try {
    // Configurer le transporteur de messagerie
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_SECRET,
      },
    });

    // Options de l'e-mail
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      text: `Votre code de vérification pour réinitialiser votre mot de passe est : ${verifUserCode}`,
    };

    // Envoyer l'e-mail
    await transporter.sendMail(mailOptions);
    console.log("E-mail de réinitialisation de mot de passe envoyé à", email);
  } catch (error) {
    throw new Error("Error sending reset password email");
  }
};

// Fonction pour vérifier si le code de vérification
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Générer le code de vérification
    const verifUserCode = generateVerificationCode();

    // Mettre à jour le code de vérification dans la base de données
    const user = await Patient.findOneAndUpdate(
      { email },
      { verifUserCode },
      { new: true }
    );

    if (!user) {
      console.log("User not found");
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    // Envoyer l'e-mail de réinitialisation de mot de passe avec le code de vérification
    await sendResetPasswordEmail(email, verifUserCode);
    console.log("Reset password email sent successfully");
    res.json({
      success: true,
      message: "Reset password email sent successfully",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res
      .status(500)
      .json({ success: false, message: "Error sending reset password email" });
  }
};

// Contrôleur pour réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  const { code, newPassword } = req.body; // Récupérer le code de vérification et le nouveau mot de passe depuis le corps de la requête

  try {
    // Récupérer l'e-mail de l'utilisateur à partir du code de vérification
    const user = await Patient.findOne({ verifUserCode: code });

    // Vérifier si l'utilisateur existe
    if (!user) {
      console.log("Invalid verification code");

      return res
        .status(404)
        .json({ success: false, message: "Invalid verification code" });
    }

    // Comparer le nouveau mot de passe avec l'ancien
    const passwordMatch = await bcrypt.compare(newPassword, user.password);
    if (passwordMatch) {
      console.log("New password must be different from the old one");
      return res.status(400).json({
        success: false,
        message: "New password must be different from the old one",
      });
    }

    // Vérifier la longueur du nouveau mot de passe
    if (newPassword.length < 8 || newPassword.length > 20) {
      console.log("Password must be 8 to 20 characters long");
      return res.status(400).json({
        success: false,
        message: "Password must be 8 to 20 characters long",
      });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    user.password = hashedPassword;
    user.verifUserCode = null; // Effacer le code de vérification après réinitialisation
    await user.save();
    console.log("Password reset successfully")
    // Répondre avec un message de succès
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ success: false, message: "Error resetting password" });
  }
};

// Fonction pour enregistrer le token FCM
exports.saveFCMToken = async (req, res) => {
  const { token, email } = req.body;

  try {
    // Trouver l'utilisateur et mettre à jour le FCMtoken
    const user = await Patient.findOneAndUpdate({ email: email }, { FCMtoken: token }, { new: true });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('Token enregistré avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du token', error);
    res.status(500).send('Erreur lors de l\'enregistrement du token');
  }
};
