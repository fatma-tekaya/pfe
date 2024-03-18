const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 
const bcrypt = require('bcrypt'); // Importez bcrypt ici pour pouvoir utiliser les fonctions de hachage de mots de passe
const cloudinary = require('../helper/imageUpload');

// Contrôleur pour créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  const { fullname, email, password } = req.body; // Extraction des données du corps de la requête
  try {
    const existingUser = await User.findOne({ email }); // Vérification si l'email est déjà utilisé

    if (existingUser) {
      return res.json({
        success: false,
        message: 'This email is already in use, try sign-in',
      });
    }

    // Hachage du mot de passe avant de l'enregistrer dans la base de données
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await User({
      fullname,
      email,
      password: hashedPassword, // Utilisez le mot de passe haché
    }); // Création d'un nouvel utilisateur avec les données fournies
    await user.save(); // Sauvegarde de l'utilisateur dans la base de données
    res.json({ success: true, user }); // Réponse JSON indiquant la réussite de la création de l'utilisateur
  } catch (error) {
    console.error('Error while creating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' }); // Gestion des erreurs
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



