import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, useEffect} from 'react';
import {BASE_URL} from '../config';
import axios from 'axios';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import ConfirmationSentScreen from '../screens/ConfirmationSentScreen';
import {NavigationContainer} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const signup = async (
    fullname,
    email,
    password,
    setIsLoading,
    navigation,
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/create-user`, {
        fullname,
        email,
        password,
      });

      console.log('Response from API:', response.data); // Log response for debugging

      if (response.data.success) {
        const userInfo = response.data; // Assuming response.data contains user info
        const userEmail = userInfo.email; // Access user email from response
        console.log('User email:', userEmail); // Log user email for debugging
        console.log('Response data ', response.data);
        // navigation.navigate('Confirmation', { email: userEmail });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Signup failed'); // Throw specific error
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error; // Re-throw for further handling
    }
    setIsLoading(false);
  };

  const login = async (email, password, setIsLoading) => {
    setIsLoading(true);

    await axios
      .post(`${BASE_URL}/sign-in`, {
        email,
        password,
      })
      .then(res => {
        console.log(res.data);
        let userInfo = res.data;
        setUserInfo(userInfo);
        setUserToken(userInfo.token);
        console.log('User Token:' + userInfo.token);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        AsyncStorage.setItem('userToken', userInfo.token);
      })
      .catch(err => console.error(err));

    setIsLoading(false);
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.configure({
        offlineAccess: false,
        webClientId:
          '972071422730-3ocqp31uq1i7guc6pqiri6u0f9gmi2u2.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);

      const { idToken, user } = userInfo;
    const googleCredentials = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredentials);
  
    const response = await axios.post(`${BASE_URL}/google-signin`, {
      idToken: idToken,
      user: user,
    });
    const { data } = response;
    const userToken  = data.token;
    const fullname =userInfo.user.name;
   
    // Stockage des informations utilisateur dans AsyncStorage
    AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    AsyncStorage.setItem('userToken', userToken);

    // Mise à jour de l'état de l'application avec les nouvelles informations utilisateur
    setUserInfo(userInfo);
    setUserToken(userToken);

    console.log('User Token:', userToken);
    console.log( fullname);
    console.log('user Info' , userInfo)
    return userInfo;
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
  finally {
    setIsLoading(false); // Définir isLoading à false une fois que la connexion est terminée (quelle que soit la résultat)
  }
};
     

  

  // TODO check
  const forgotPassword = async (email) => {
    setIsLoading(true);
    try {
      const resp = await axios.post(`${BASE_URL}/forgot-password`, { email });
      console.log('Reset password email sent successfully');
     
      return resp;
    } catch (error) {
      console.error('Error sending reset password email:', error);
      // Afficher un message d'erreur à l'utilisateur ou effectuer d'autres actions en cas d'erreur
      // Vous pouvez également renvoyer l'erreur pour une gestion plus avancée
      throw error;

    } finally {
      setIsLoading(false);
    }
  };
  

  const updateUserProfile = async updatedData => {
    try {
      const response = await axios.put(
        `${BASE_URL}/upload-profile`,
        updatedData,
        {
          headers: {
            Authorization: `jwt ${userToken}`, // Inclure le token dans les en-têtes de la requête
          },
        },
      );
      console.log('Profile updated successfully:', response.data);
      // Traitez la réponse de l'API si nécessaire
    } catch (error) {
      console.error('Error updating profile:', error);
      // Gérez les erreurs ici
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Récupérer le token depuis AsyncStorage
      const storedToken = await AsyncStorage.getItem('userToken');
      if (!storedToken) {
        console.error('No token found in AsyncStorage');
        return; // Sortir de la fonction si aucun token n'est trouvé
      }
  
      const resp = await axios.post(`${BASE_URL}/sign-out`, null, {
        headers: {
          Authorization: `Bearer ${storedToken}`, // Utiliser le token stocké pour l'authentification
        },
      });
      if (resp.data.success) {
        // Déconnexion réussie
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        console.log('Logged out successfully');
      } else {
        // Gestion des erreurs côté frontend si la déconnexion a échoué
        console.error('Logout failed:', resp.data.message);
        // Affichez un message à l'utilisateur ou redirigez-le vers la page de connexion, par exemple
      }
    } catch (error) {
      // Gestion des erreurs réseau ou autres erreurs
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem('userInfo');
      let userToken = await AsyncStorage.getItem('userToken');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserToken(userToken);
        setUserInfo(userInfo);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(`isLogged in error ${error}`);
    }
  };
  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signup,
        forgotPassword,
        updateUserProfile,
        signInWithGoogle,
        isLoading,
        userToken,
        setIsLoading,
        userInfo,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
