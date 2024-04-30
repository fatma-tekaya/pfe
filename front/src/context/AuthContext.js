import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, useEffect} from 'react';
import {BASE_URL} from '../config';
import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {FormData} from "formdata-node";
import CustomLoader from "../components/CustomLoader";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);


  const signup = async (fullname, email, password,confirmPassword) => {
    try {
      const response = await axios.post(`${BASE_URL}/create-user`, {
        fullname,
        email,
        password,
        confirmPassword,
      });

      console.log('Response from API:', response.data); // Log response for debugging

      if (response.data.success) {
        const userInfo = response.data; // Assuming response.data contains user info
        // Access user email from response
        console.log('User email:', email); // Log user email for debugging
        console.log('Response data ', response.data);
        //navigation.navigate('Confirmation');

        return response.data;
      } else {
        throw new Error(response.data.message || 'Signup failed'); // Throw specific error
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setIsLoading(false); // Move setIsLoading(false) here for error case
      throw error; // Re-throw for further handling
    }
  };

  const confirm = async (verificationCode) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/verify-email`, {
        verificationCode: verificationCode
      });
      //console.log('Response from API:', response);
      if (response.data.success) {
        console.log('User verified!');
        setIsLoading(false);
        return response.data.success;
      } else {
        alert("Invalid Code!");
      }
    } catch (error) {
      console.log(error);
      alert("Error confirming verification code!");
    }
    setIsLoading(false);
  };

  const login = async (email, password) => {
    setIsLoading(true);
  
    try {
      const response = await axios.post(`${BASE_URL}/sign-in`, {
        email,
        password,
      });
  
      const userInfo = response.data;
      console.log(userInfo);
  
      setUserInfo(userInfo);
      setUserToken(userInfo.token);
  
      console.log('User Token:' + userInfo.token);
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      AsyncStorage.setItem('userToken', userInfo.token);
  
      setIsLoading(false); // Mettre isLoading à false une fois la requête terminée avec succès
  
      return userInfo;
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoading(false); // Mettre isLoading à false en cas d'erreur
      throw error; // Lancer une erreur avec le message d'erreur du serveur en cas d'échec
    }
  };
  
  const signInOrSignUpWithGoogle = async () => {
    try {
      setIsLoading(true);
  
      await GoogleSignin.configure({
        offlineAccess: false,
        webClientId: '972071422730-3ocqp31uq1i7guc6pqiri6u0f9gmi2u2.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
      await GoogleSignin.hasPlayServices();
  
      // Sign out before signing in to ensure a clean sign-in process
      await GoogleSignin.signOut();
  
      // Sign in with Google and force account selection
      const { idToken, user } = await GoogleSignin.signIn({ forceCodeForRefreshToken: true });
  
      // Send user info to backend for authentication or registration
      const response = await axios.post(`${BASE_URL}/google-signin`, {
        idToken: idToken,
        user: user,
      });
  
      const { data } = response;
      const userToken = data.token;
      const userInfo = {
        user: {
          ...data.user,
          fullname: user.name,
          avatar: user.photo,
        },
      };
  
      setUserInfo(userInfo);
      setUserToken(userToken);
  
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      AsyncStorage.setItem('userToken', userToken);
  
      setIsLoading(false);
  
      return user; // Return user info on success
    } catch (error) {
      console.error('Error signing in or signing up with Google:', error);
      setIsLoading(false);
      throw error; // Throw error to handle failure in calling component
    }
  };
  

  const forgotPassword = async email => {
    setIsLoading(true);
    try {
      const resp = await axios.post(`${BASE_URL}/forgot-password`, {email});
      console.log('Reset password email sent successfully');
      setIsLoading(false);
      return resp.data;
      //return resp;
    } catch (error) {
      console.error('Error sending reset password email:', error);
      // Afficher un message d'erreur à l'utilisateur ou effectuer d'autres actions en cas d'erreur
      // Vous pouvez également renvoyer l'erreur pour une gestion plus avancée
      throw error;
    }
  };
  
  const resetPasssword = async (code ,newPassword)=>{
    setIsLoading(true);
    try {
      const resp = await axios.post(`${BASE_URL}/reset-password`, {code ,newPassword});
      console.log(' password Reset successfully');
      setIsLoading(false);
      return resp.data;
    } catch (error) {
      console.error('Error  reset password email:', error);
      // Afficher un message d'erreur à l'utilisateur ou effectuer d'autres actions en cas d'erreur
      // Vous pouvez également renvoyer l'erreur pour une gestion plus avancée
      throw error;
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

  const updateUserProfile = async updatedData => {
    try {
      const formData = new FormData();
  
      // Append each field to the FormData object
      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }
  
      // Append the image file to the FormData object
      if (updatedData.avatar) {
        formData.append('profile', {
          uri: updatedData.avatar,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
      }
  
      // Send the request
      const response = await fetch(`${BASE_URL}/upload-profile`, {
        method: 'PUT',
        headers: {
          Authorization: `jwt ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      // Check if the request was successful (status code in the range 200-299)
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      // Handle the response data
      const data = await response.json();
      const updatedUserInfo = {
        ...userInfo,
        user: {
          ...userInfo.user,
          ...updatedData,
        },
      };
  
      setUserInfo(updatedUserInfo); // Mettre à jour les données utilisateur dans le contexte
      AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo)); // Stocker les données utilisateur mises à jour dans AsyncStorage
  
      console.log('Profile updated successfully:', data);
  
      // Handle the response if needed
    } catch (error) {
      console.error('Error updating profile:', error);
      // Gérer les erreurs ici
    }
  };
  
 

  useEffect(() => {
    isLoggedIn();
  }, []);
  
  if (isLoading) {
    return <CustomLoader />;
  }


  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signup,
        forgotPassword,
        setUserInfo,
        resetPasssword,
        signInOrSignUpWithGoogle,
        isLoading,
        userToken,
        setIsLoading,
        setUserInfo,
        confirm,
        userInfo,
        updateUserProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};