const jwt = require("jsonwebtoken");
const User = require("../models/User");
const axios = require('axios');
const bcrypt = require("bcrypt");
const cloudinary = require("../helper/imageUpload");
const nodemailer = require("nodemailer");
//const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");


//Fonction  pour envoyer un mail de confirmation de user
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
//fonction cree user 
exports.createUser = async (req, res) => {
  const { fullname, email, password, confirmPassword,FCMtoken } = req.body;

  // Vérification des erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("err", errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const existingUser = await User.findOne({ email });
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

    // Création du canal dans ThingSpeak
    const thingspeakResponse = await axios.post('https://api.thingspeak.com/channels.json', {
      api_key: '9Q84GLMDN0DIJLRR',
      name: 'signevitaux',
      field1: 'température',
      field2: 'rythmeCardiaque',
      field3: 'spo2'
    });

    // Vérification de la réponse de ThingSpeak
    if (thingspeakResponse.status === 200) {
      const Info = thingspeakResponse.data; // Récupérer l'ID du canal à partir de la réponse
      
      // Enregistrement de l'utilisateur dans la base de données avec l'ID du canal
      const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
        verified: false,
        verificationCode,
        channelInfo:Info, 
        FCMtoken:FCMtoken
      });
    
      await newUser.save();

      res.status(200).json({ success: true, message: `User created. Verification code sent to ${email}` });
    } else {
      res.status(500).json({ success: false, message: "Error creating ThingSpeak channel" });
    }
  } catch (error) {
    console.error("Error while creating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fonction  pour envoyer le code de vérification
exports.confirmEmailAndRegisterUser = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    // Recherche de l'utilisateur dans la base de données en utilisant le code de vérification
    const user = await User.findOne({ verificationCode });

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
    res.status(200).json({ success: true, message: "User verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Contrôleur pour connecter un utilisateur
exports.userSignIn = async (req, res) => {
  const { email, password ,FCMtoken} = req.body; // Extraction des données du corps de la requête
  try {
    const user = await User.findOne({ email }); // Recherche de l'utilisateur dans la base de données
    if (!user) {
      console.log("User not found with the given email!")
      return res.json({
        success: false,
        message: "User not found with the given email!",
      });
    }
    if (!user.verified) {
      console.log('User is not verified Yet!')
      return res.json({
        success: false,
        message: "User is not verified Yet!",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Email/password does not match!")
      return res.json({
        success: false,
        message: "Email/password does not match!",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }); // Création d'un token JWT pour l'authentification de l'utilisateur

    // Ajout du nouveau token à l'array tokens de l'utilisateur
    user.tokens.push({ token });
    //fcm token 
    if(!!FCMtoken){
      user.FCMtoken=FCMtoken
      //user.save()
   }
    // Sauvegarde de l'utilisateur avec le nouveau token
    await user.save();
    console.log("user signed in successfully")
    res.json({
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        location: user.location,
        birthdate: user.birthdate,
        channelInfo:user.channelInfo,
        FCMtoken:user.FCMtoken,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        avatar: user.avatar ? user.avatar : "",
      },
      token,
    }); // Réponse JSON avec les informations utilisateur et le token
  } catch (error) {
    console.error("Error while signing in:", error);
    res.status(500).json({ success: false, message: "Internal server error" }); // Gestion des erreurs
  }
};

// Controller pour la connexion via Google
exports.signInWithGoogle = async (req, res) => {
  const { email, name, photo, idToken } = req.body.user;

  try {
    let user = null;
    // Vérifiez si l'utilisateur existe déjà dans la base de données en utilisant son email
    if (email) {
      user = await User.findOne({ email });
    }

    if (user) {
      // Utilisateur existant : mettez à jour ses informations avec celles fournies par Google
      user.fullname = name;
      user.avatar = photo ? photo : user.avatar; // Mettez à jour la photo uniquement si une nouvelle photo est fournie

      // Mise à jour d'autres champs si nécessaire

      // Générez ou récupérez le token JWT pour l'utilisateur existant
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Ajoutez le nouveau token à la liste des tokens de l'utilisateur existant
      user.tokens.push({ token });

      // Enregistrez les modifications de l'utilisateur
      await user.save();

      console.log("User signed in successfully");

      // Répondez avec un message de succès et le token
      return res
        .status(200)
        .json({ success: true, message: "User signed in successfully", token });
    }

    // Si l'utilisateur n'existe pas, créez un nouvel utilisateur en utilisant les informations fournies par Google
    const newUser = new User({
      fullname: name,
      email: email,
      avatar: photo ? photo : "",
      verified: true,
      // Stockez l'identifiant Google dans un champ différent
      googleToken: idToken,
      // Ajoutez d'autres champs si nécessaire
    });

    // Générez un token JWT pour l'authentification de l'utilisateur
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Ajoutez le nouveau token à la liste des tokens du nouvel utilisateur
    newUser.tokens.push({ token });

    // Enregistrez le nouvel utilisateur dans la base de données
    await newUser.save();

    console.log("User registered and signed in successfully");

    // Répondez avec un message de succès et le token
    res
      .status(201)
      .json({
        success: true,
        message: "User registered and signed in successfully",
        token,
      });
  } catch (error) {
    console.error("Error signing in with Google:", error);
    // Gérez les erreurs internes du serveur
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Contrôleur pour déconnecter l'utilisateur
exports.signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]; // Extraction du token à partir des en-têtes de la requête
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization fail!" }); // Si aucun token n'est fourni, renvoyer un message d'erreur
    }

    const tokens = req.user.tokens; // Récupération des tokens de l'utilisateur depuis la requête

    const newTokens = tokens.filter((t) => t.token !== token); // Filtrage des tokens pour exclure celui qui est utilisé pour la déconnexion

    // Mise à jour des tokens de l'utilisateur dans la base de données
    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: "Sign out successfully!" }); // Réponse indiquant le succès de la déconnexion
    console.log("logged out ");
  }
};

//Fonction pour update  user profile
exports.uploadProfile = async (req, res) => {
  const { user } = req; // Récupération de l'utilisateur depuis la requête
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: 'unauthorized access!' }); // Si l'utilisateur n'est pas authentifié, renvoyer un message d'erreur

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
        crop: 'fill',
      });
      updateFields.avatar = result.url; // Mettre à jour l'avatar avec l'URL de l'image téléchargée
    }

    // Mise à jour de l'utilisateur dans la base de données si des champs à mettre à jour sont fournis
    if (Object.keys(updateFields).length > 0) {
      let updatedUser;
      {
        // Si l'utilisateur n'est pas connecté avec Google, mettez simplement à jour son profil
        updatedUser = await User.findByIdAndUpdate(
          user._id,
          updateFields,
          { new: true }
        );
      }
      console.log("updated Successfuly!");
      res.status(200).json({ success: true, user: updatedUser }); // Réponse indiquant le succès de la mise à jour du profil
    } else {
      console.log("No fields provided for update")
      res
        .status(400)
        .json({ success: false, message: 'No fields provided for update' }); // Si aucun champ à mettre à jour n'est fourni dans la requête, renvoyer un message d'erreur
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'server error, try after some time' }); // En cas d'erreur lors de la mise à jour du profil, renvoyer un message d'erreur
    console.log('Error while updating profile', error.message); // Affichage de l'erreur dans la console
  }
};


// Fonction for uploading additional pictures
exports.uploadPicture = async (req, res) => {
  const { user } = req; // Get the user from the request

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access!" });
  }

  const picture = req.file ? req.file.path : null; // Get the uploaded picture

  try {
    if (picture) {
      // Add the picture path to the user's captures array
      user.captures.push(picture);

      // Save the updated user document
      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Picture uploaded successfully" });
    } else {
      res.status(400).json({ success: false, message: "No picture provided" });
    }
  } catch (error) {
    console.error("Error uploading picture:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error, try again later" });
  }
};

//Fonction pour générer un code de vérification aléatoire
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

//Fonction pour  vérifier si le code de vérification
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Générer le code de vérification
    const verifUserCode = generateVerificationCode();

    // Mettre à jour le code de vérification dans la base de données
    const user = await User.findOneAndUpdate(
      { email },
      { verifUserCode },
      { new: true }
    );

    if (!user) {
      console.log("User not found")
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    // Envoyer l'e-mail de réinitialisation de mot de passe avec le code de vérification
    await sendResetPasswordEmail(email, verifUserCode);
    console.log("Reset password email sent successfully")
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
    const user = await User.findOne({ verifUserCode: code });

    // Vérifier si l'utilisateur existe
    if (!user) {
      console.log("Invalid verification code")
      return res
        .status(404)
        .json({ success: false, message: "Invalid verification code" });
    }

    // Comparer le nouveau mot de passe avec l'ancien
    const passwordMatch = await bcrypt.compare(newPassword, user.password);
    if (passwordMatch) {
      console.log("New password must be different from the old one")
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be different from the old one",
        });
    }

    // Vérifier la longueur du nouveau mot de passe
    if (newPassword.length < 8 || newPassword.length > 20) {
      console.log("Password must be 8 to 20 characters long")
      return res
        .status(400)
        .json({
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
