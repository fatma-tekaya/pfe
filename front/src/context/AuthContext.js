import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';
import { BASE_URL } from '../config';
import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FormData } from "formdata-node";
import CustomLoader from "../components/CustomLoader";
import Toast from 'react-native-toast-message';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const signup = async (fullname, email, password, confirmPassword, navigation) => {
    setIsLoading(true)
    try {
      console.log(`Sending request to: ${BASE_URL}/create-user`);
      const response = await axios.post(`${BASE_URL}/create-user`, {
        fullname,
        email,
        password,
        confirmPassword,
      });

      console.log('Response from API:', response);

      if (response.data.success) {
        console.log('Response data', response.data);
        setIsLoading(false);
        navigation.navigate('Confirmation', { email }); // Utilisez navigation ici
      } else {
        setIsLoading(false);
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const confirm = async (verificationCode, email, navigation) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/verify-email`, {
        verificationCode
      });

      if (response.data.success) {
      
        setIsLoading(false);
        navigation.navigate('Success', { email }); // Utilisez navigation ici
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2:'Invalid Code!',
          text1Style: { fontSize: 14 },
          text2Style: { fontSize: 14 }
        });
       
        setIsLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:'Error confirming verification code!',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
      setIsLoading(false);
    }
  };


  const login = async (email, password) => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/sign-in`, {
        email,
        password
      });

      const userInfo = response.data;
      setUserInfo(userInfo);
      setUserToken(userInfo.token);

      //console.log('User Token:' + userInfo.token);
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      AsyncStorage.setItem('userToken', userInfo.token);
      AsyncStorage.setItem('refreshToken', userInfo.refreshToken);
      console.log("rfresh", userInfo.refreshToken);
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
      return user;
    } catch (error) {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email, navigation) => {
    setIsLoading(true);
    try {
      const resp = await axios.post(`${BASE_URL}/forgot-password`, { email });
      if (resp.data.success) {
        setIsLoading(false);
        navigation.navigate('Code', { email });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Sending reset password successfuly',
          text1Style: { fontSize: 14 },
          text2Style: { fontSize: 14 },
        });
     

        return resp.data;
      } else {
       
        Toast.show({
          type: 'Error',
          text1: 'Error',
          text2: resp.data.message,
          text1Style: { fontSize: 14 },
          text2Style: { fontSize: 14 },
        });
        setIsLoading(false);
      }

    } catch (error) {
      Toast.show({
        type: 'Error',
        text1: 'Error',
        text2: 'Error sending reset password to email',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 },
      });
      setIsLoading(false);
      throw error;
    }
  };

  const resetPasssword = async (code, newPassword) => {
    setIsLoading(true);
    try {
      const resp = await axios.post(`${BASE_URL}/reset-password`, { code, newPassword });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password Reset successfully.',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 },
      });
      setIsLoading(false);
      return resp.data;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Check your fields please !',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 },
      });
      setIsLoading(false);
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

      // const resp = await axios.post(`${BASE_URL}/sign-out`, null, {
      //   headers: {
      //     Authorization: `Bearer ${storedToken}`, // Utiliser le token stocké pour l'authentification
      //   },
      // });
      // if (resp.data.success) {
      //   // Déconnexion réussie
      setUserToken(null);
      AsyncStorage.removeItem('userInfo');
      AsyncStorage.removeItem('userToken');
      console.log('Logged out successfully');
      // } else {
      //   // Gestion des erreurs côté frontend si la déconnexion a échoué
      //   console.error('Logout failed:', resp.data.message);
      //   // Affichez un message à l'utilisateur ou redirigez-le vers la page de connexion, par exemple
      // }
    } catch (error) {
      // Gestion des erreurs réseau ou autres erreurs
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
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
      if (updatedData.profile) {
        formData.append('profile', {
          uri: updatedData.profile,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
      }

      // Send the request
      const response = await fetch(`${BASE_URL}/upload-profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userToken}`,
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
          ...data.user, // Ensure to merge the updated user data
        },
      };

      setUserInfo(updatedUserInfo); // Mettre à jour les données utilisateur dans le contexte
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo)); // Stocker les données utilisateur mises à jour dans AsyncStorage
      Toast.show({
        type: 'success',
        text1: 'Update',
        text2: 'Profile updated successfully',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update error',
        text2: 'Error updating profile',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
    }
  };
  if (isLoading) {
    <CustomLoader />;
  }



  useEffect(() => {
    const startTokenRefreshTimer = async () => {
      const refreshInterval = 60 * 60 * 1000; // 30 minutes

      const timerId = setTimeout(async () => {
        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');

          const response = await axios.post(`${BASE_URL}/refresh`, {
            token: refreshToken,
          });

          const { token: newToken, refreshToken: newRefreshToken } = response.data;

          await AsyncStorage.setItem('userToken', newToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);

          startTokenRefreshTimer();
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }, refreshInterval);

      return () => clearTimeout(timerId); // Nettoyer le timer lorsqu'il n'est plus nécessaire
    };

    // const loadInitialData = async () => {
    //   setIsLoading(true);
    //   try {
    //     const storedUserToken = await AsyncStorage.getItem('userToken');
    //     const storedUserInfo = await AsyncStorage.getItem('userInfo');
    //     if (storedUserToken && storedUserInfo) {
    //       setUserToken(storedUserToken);
    //       setUserInfo(JSON.parse(storedUserInfo));
    //     }
    //   } catch (error) {
    //     console.error('Error loading initial data:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // loadInitialData();
  }, []);




  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signup,
        forgotPassword,
        updateUserProfile,
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