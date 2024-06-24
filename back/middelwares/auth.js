const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 

// Middleware pour vérifier l'authentification de l'utilisateur
exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) { // Vérification de la présence d'en-têtes d'autorisation dans la requête
    const token = req.headers.authorization.split(' ')[1]; // Extraction du token à partir des en-têtes d'autorisation

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET); // Vérification et décodage du token JWT
      const user = await User.findById(decode.userId); // Recherche de l'utilisateur dans la base de données en utilisant l'ID décodé du token

      if (!user) { // Si aucun utilisateur correspondant n'est trouvé
        return res.json({ success: false, message: 'unauthorized access!' }); // Renvoyer une réponse indiquant un accès non autorisé
      }

      req.user = user; // Ajout de l'utilisateur à l'objet de requête pour une utilisation ultérieure
      next(); // Appel de la fonction next() pour passer au middleware suivant
    } catch (error) {
      if (error.name === 'JsonWebTokenError') { // Si une erreur de token JWT est détectée
        return res.json({ success: false, message: 'unauthorized access!' }); // Renvoyer une réponse indiquant un accès non autorisé
      }
      if (error.name === 'TokenExpiredError') { // Si le token JWT a expiré
        return res.json({
          success: false,
          message: 'session expired try sign in!', // Renvoyer une réponse indiquant que la session a expiré
        });
      }

      res.json({ success: false, message: 'Internal server error!' }); // En cas d'autres erreurs, renvoyer une réponse d'erreur interne du serveur
    }
  } else {
    res.json({ success: false, message: 'unauthorized access!' }); // Si aucun token n'est trouvé dans les en-têtes d'autorisation, renvoyer une réponse indiquant un accès non autorisé
  }
};
exports.verifyRefreshToken = (req, res, next) => {
  const { token: refreshToken } = req.body;

  if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Refresh token required" });
  }

  try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      req.user = decoded; // Optionally attach user details to the request
      next();
  } catch (error) {
      res.status(403).json({ success: false, message: "Invalid refresh token" });
  }
};
