import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GoogleSVG from '../assets/images/misc/google.svg';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, setIsLoading, signInOrSignUpWithGoogle, userInfo } = useContext(AuthContext);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const validateInputs = () => {
    let valid = true;
    if (!email.includes('@gmail.com')) {
      setEmailError('Email must be in the format xxxxxx@gmail.com');
      valid = false;
    } else {
      setEmailError('');
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };
  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please complete all fields.',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
      return;
    }
    if (!validateInputs()) {
      return;
    }
    try {
      let FCMtoken = await AsyncStorage.getItem('fcm_token')
      const resp = await login(email, password, FCMtoken);
      // Vérifiez si l'authentification est réussie
      if (resp.success) {
        // L'authentification a réussi, naviguez vers la page d'accueil
        console.log("User authenticated!");
      } else {
        // L'authentification a échoué, affichez un message d'erreur à l'utilisateur
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: userInfo.message,
          text1Style: { fontSize: 14 },
          text2Style: { fontSize: 14 }
        });
      }
    } catch (error) {
      Toast.show({
        type: 'info',
        text1: 'Error sign in',
        text2: 'Please try again later.',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={globalStyles.container}>
          <Image style={globalStyles.image} source={require('../assets/images/logovff-sarr.png')} />
        </View>
        <Text
          style={globalStyles.texttitle }>
          Login
        </Text>
        <InputField
          label={'Email'}
          value={email}
          icon={
            <MaterialIcons
              name="email"
              size={20}
              color="#666"
              style={{ marginRight: 5 ,marginTop:6}}
            />
          }

          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
        />
        {emailError ? <Text style={globalStyles.errorText}>{emailError}</Text> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <InputField
            label={'Password'}
            value={password}
            icon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            inputType={passwordVisible ? 'text' : 'password'}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{ position: 'absolute', right: 10, top: 10 }}>
            <Ionicons
              name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={globalStyles.errorText}>{passwordError}</Text> : null}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Forgot');
          }}>
          <Text
            style={{ color: colors.blue_fonce, fontFamily: 'Outfit-Medium', textAlign: 'right', marginBottom: 20 }}>
            {' '}
            Forgot Password ?
          </Text>
        </TouchableOpacity>
        <CustomButton
          label={'Login'}
          onPress={handleSignIn}
        />
        <Text style={{ textAlign: 'center',fontFamily: 'Outfit-Medium',color: '#666', marginBottom: 10 }}>
          Or, 
        </Text>
        <View
          style={{
            
            alignItems: 'center', // Alignez les éléments verticalement au centre
            marginBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              signInOrSignUpWithGoogle();
            }}
            style={globalStyles.buttonContainer}
          >
            <GoogleSVG height={24} width={24} />
            <Text style={globalStyles.buttonText}>Login with Google</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
            marginTop: 20
          }}>
          <Text style={{ color: '#666' ,fontFamily: 'Outfit-Medium'}}>New to the app ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: '#0f3f61', fontWeight: '700',fontFamily: 'Outfit-Medium' }}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
