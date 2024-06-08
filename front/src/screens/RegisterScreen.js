import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import InputField from '../components/InputField';
import { AuthContext } from '../context/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GoogleSVG from '../assets/images/misc/google.svg';
import CustomButton from '../components/CustomButton';
import { globalStyles } from '../styles/globalStyles';
import Toast from 'react-native-toast-message';

const RegisterScreen = ({ navigation }) => {
  const [fullname, setFullname] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const { signup, signInOrSignUpWithGoogle } = useContext(AuthContext);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [CpasswordError, setCPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

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
    if (password !== confirmPassword) {
      setCPasswordError('Passwords do not match');
      valid = false;
    } else {
      setCPasswordError('');
    }

    return valid;
  };

  const handleSignup = async () => {
    if (!fullname || !email || !password || !confirmPassword) {
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
      await signup(fullname, email, password, confirmPassword, navigation);
    } catch (error) {
      alert(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 25 }}>
        <View style={globalStyles.container}>
          <Image style={globalStyles.image} source={require('../assets/images/logovff-sarr.png')} />
        </View>
        <Text
          style={globalStyles.texttitle}>
          Register
        </Text>
        <InputField
          label={'Full Name'}
          value={fullname}
          onChangeText={text => setFullname(text)}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
        />
        <InputField
          label={'Email'}
          value={email}
          onChangeText={text => setEmail(text)}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          keyboardType="email-address"
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <InputField
            label={'Confirm Password'}
            value={confirmPassword}
            icon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            inputType={passwordVisible1 ? 'text' : 'password'}
            onChangeText={text => setConfirmPassword(text)}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility1}
            style={{ position: 'absolute', right: 10, top: 10 }}>
            <Ionicons
              name={passwordVisible1 ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {CpasswordError ? <Text style={globalStyles.errorText}>{CpasswordError}</Text> : null}

        <CustomButton label={'Register'} onPress={handleSignup} />
        <Text style={{
          textAlign: 'center', color: '#666', marginBottom: 20, fontFamily: 'Outfit-Medium',
        }}>
          Or, login with email ...
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center', // Alignez les éléments verticalement au centre
            marginBottom: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              signInOrSignUpWithGoogle();
            }}
            style={globalStyles.buttonContainer}
          >
            <GoogleSVG height={24} width={24} />
            <Text style={globalStyles.buttonText}>login with gmail</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text style={{ color: '#666', fontFamily: 'Outfit-Medium', }}>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{
              color: '#0f3f61', fontWeight: '700', fontFamily: 'Outfit-Medium',
            }}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;