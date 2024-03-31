const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 
const bcrypt = require('bcrypt'); // Importez bcrypt ici pour pouvoir utiliser les fonctions de hachage de mots de passe
const cloudinary = require('../helper/imageUpload');
const nodemailer = require('nodemailer');


// Contrôleur pour créer un nouvel utilisateur
// exports.createUser = async (req, res) => {
//   const { fullname, email, password } = req.body; // Extraction des données du corps de la requête
//   try {
//     const existingUser = await User.findOne({ email }); // Vérification si l'email est déjà utilisé

//     if (existingUser) {
//       return res.json({
//         success: false,
//         message: 'This email is already in use, try sign-in',
//       });
//     }

//     // Hachage du mot de passe avant de l'enregistrer dans la base de données
//     const hashedPassword = await bcrypt.hash(password, 8);

//     const user = await User({
//       fullname,
//       email,
//       password: hashedPassword, // Utilisez le mot de passe haché
//     }); // Création d'un nouvel utilisateur avec les données fournies
//     await user.save(); // Sauvegarde de l'utilisateur dans la base de données
//     res.json({ success: true, user }); // Réponse JSON indiquant la réussite de la création de l'utilisateur
//   } catch (error) {
//     console.error('Error while creating user:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' }); // Gestion des erreurs
//   }
// };

 // Fonction pour envoyer l'e-mail de confirmation
const sendConfirmationEmail = async (toEmail, confirmationToken) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_SECRET
    }
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: toEmail,
    subject: 'Confirmation de votre inscription',
    text: `Merci de vous être inscrit sur notre plateforme. Veuillez confirmer votre adresse e-mail en cliquant sur le lien suivant : ${confirmationToken}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail de confirmation envoyé à', toEmail);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation :', error);
  }
};

exports.createUser = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: 'This email is already in use, try sign-in',
      });
    }

    const tokenData = { fullname, email, password };
    const confirmationToken = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Construction du lien de confirmation
    const confirmationLink = `${req.protocol}://${req.get('host')}/confirm-email/${confirmationToken}`;


    // Envoi de l'e-mail de confirmation avec le lien de confirmation
    await sendConfirmationEmail(email, confirmationLink);

    res.json({ success: true, message: 'Confirmation email sent successfully' });
  } catch (error) {
    console.error('Error while creating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.confirmEmailAndRegisterUser = async (req, res) => {
  const token = req.params.token; // Utilisez req.params.token pour récupérer le token du chemin de l'URL

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { fullname, email, password } = decodedToken;

    // Recherche de l'utilisateur dans la base de données
    let existingUser = await User.findOne({ email });

    // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
    if (!existingUser) {
      // Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création du nouvel utilisateur avec le mot de passe hashé
      existingUser = new User({ fullname, email, password: hashedPassword });

      // Marquer l'e-mail comme confirmé
      existingUser.isEmailConfirmed = true;

      // Enregistrement du nouvel utilisateur dans la base de données
      await existingUser.save();

      // Répondre avec un message de succès
      return res.json({ success: true, message: 'Email confirmed successfully and user registered.' });
    }

    // Si l'utilisateur existe déjà, marquer simplement son e-mail comme confirmé
    existingUser.isEmailConfirmed = true;
    await existingUser.save();

    // Répondre avec un message de succès
    res.json({ success: true, message: 'Email confirmed successfully.' });
  } catch (error) {
    console.error('Error confirming email:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Contrôleur pour connecter un utilisateur
exports.userSignIn = async (req, res) => {
  const { email, password } = req.body; // Extraction des données du corps de la requête
  try {
    const user = await User.findOne({ email }); // Recherche de l'utilisateur dans la base de données
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found with the given email!',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: 'Email/password does not match!',
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    }); // Création d'un token JWT pour l'authentification de l'utilisateur

    // Ajout du nouveau token à l'array tokens de l'utilisateur
    user.tokens.push({ token });

    // Sauvegarde de l'utilisateur avec le nouveau token
    await user.save();

    res.json({
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar ? user.avatar : '',
      },
      token,
    }); // Réponse JSON avec les informations utilisateur et le token
  } catch (error) {
    console.error('Error while signing in:', error);
    res.status(500).json({ success: false, message: 'Internal server error' }); // Gestion des erreurs
  }
};


exports.facebookAuth = (req, res, next) => {
  try {
    console.log("test" + req.body.id);
    User.findOne({ facebook_id: req.body.id }).then((user) => {
      // user = users[0];

      if (!user) {
        var user = new User({
          facebook_id: req.body.id,
          fullname: req.body.fullname,
          email:req.body.email,
        });
        user.save().then((result) =>
          res.json({
            status: "success",
            message: "user successfully added",
            data: result,
          })
        );
      } else {
        res.json({ data: user });
      }
    });
  } catch (error) {
    return next(error);
  }
};

// Contrôleur pour déconnecter l'utilisateur
exports.signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]; // Extraction du token à partir des en-têtes de la requête
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization fail!' }); // Si aucun token n'est fourni, renvoyer un message d'erreur
    }

    const tokens = req.user.tokens; // Récupération des tokens de l'utilisateur depuis la requête

    const newTokens = tokens.filter(t => t.token !== token); // Filtrage des tokens pour exclure celui qui est utilisé pour la déconnexion

    // Mise à jour des tokens de l'utilisateur dans la base de données
    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: 'Sign out successfully!' }); // Réponse indiquant le succès de la déconnexion
   console.log('logged out ')
  }
};

// Contrôleur pour mettre à jour l'avatar de l'utilisateur
exports.uploadProfile = async (req, res) => {
  const { user } = req; // Récupération de l'utilisateur depuis la requête
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: 'unauthorized access!' }); // Si l'utilisateur n'est pas authentifié, renvoyer un message d'erreur

  const { fullname, email } = req.body;
  const avatar = req.file ? req.file.path : null; // Si une nouvelle image est fournie, utilisez-la, sinon, laissez-la nulle

  try {
    // Construction de l'objet de mise à jour en fonction des champs fournis
    const updateFields = {};
    if (fullname) updateFields.fullname = fullname;
    if (email) updateFields.email = email;
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
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        updateFields,
        { new: true }
      );
      res.status(200).json({ success: true, user: updatedUser }); // Réponse indiquant le succès de la mise à jour du profil
    } else {
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
// Route for uploading additional pictures
exports.uploadPicture = async (req, res) => {
  const { user } = req; // Get the user from the request
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized access!' });
  }

  const picture = req.file ? req.file.path : null; // Get the uploaded picture

  try {
    if (picture) {
      // Add the picture path to the user's captures array
      user.captures.push(picture);
      
      // Save the updated user document
      await user.save();

      res.status(200).json({ success: true, message: 'Picture uploaded successfully' });
    } else {
      res.status(400).json({ success: false, message: 'No picture provided' });
    }
  } catch (error) {
    console.error('Error uploading picture:', error);
    res.status(500).json({ success: false, message: 'Server error, try again later' });
  }
};

// Fonction pour générer un code de vérification aléatoire
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000); // Génère un nombre aléatoire à 6 chiffres
};

// Fonction pour envoyer l'e-mail de réinitialisation de mot de passe avec le code de vérification
const sendResetPasswordEmail = async (email, verificationCode) => {
  try {
    // Configurer le transporteur de messagerie
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_SECRET
      }
    });

    // Options de l'e-mail
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Votre code de vérification pour réinitialiser votre mot de passe est : ${verificationCode}`
    };

    // Envoyer l'e-mail
    await transporter.sendMail(mailOptions);
    console.log('E-mail de réinitialisation de mot de passe envoyé à', email);
  } catch (error) {
    throw new Error('Error sending reset password email');
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Générer le code de vérification
    const verificationCode = generateVerificationCode();

    // Mettre à jour le code de vérification dans la base de données
    const user = await User.findOneAndUpdate({ email }, { verificationCode }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Envoyer l'e-mail de réinitialisation de mot de passe avec le code de vérification
    await sendResetPasswordEmail(email, verificationCode);

    res.json({ success: true, message: 'Reset password email sent successfully' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ success: false, message: 'Error sending reset password email' });
  }
};

// Contrôleur pour réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  const { code, newPassword } = req.body; // Récupérer le code de vérification et le nouveau mot de passe depuis le corps de la requête
  
  try {
    // Récupérer l'e-mail de l'utilisateur à partir du code de vérification
    const user = await User.findOne({ verificationCode: code });

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid verification code' });
    }

    // Vérifier si le nouveau mot de passe est différent de l'ancien
    if (newPassword === user.password) {
      return res.status(400).json({ success: false, message: 'New password must be different from the old one' });
    }

    // Vérifier la longueur du nouveau mot de passe
    if (newPassword.length < 8 || newPassword.length > 20) {
      return res.status(400).json({ success: false, message: 'Password must be 8 to 20 characters long' });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    user.password = hashedPassword;
    user.verificationCode = null; // Effacer le code de vérification après réinitialisation
    await user.save();

    // Répondre avec un message de succès
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
};
