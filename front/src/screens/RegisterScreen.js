import React, {useState, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import InputField from '../components/InputField';
import {AuthContext} from '../context/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RegistrationSVG from '../assets/images/log.svg';
import GoogleSVG from '../assets/images/misc/google.svg';
import FacebookSVG from '../assets/images/misc/facebook.svg';
import TwitterSVG from '../assets/images/misc/twitter.svg';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import { useDrawerProgress } from '@react-navigation/drawer';

const RegisterScreen = ({navigation}) => {
  const [fullname, setFullname] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const {signup, setIsLoading} = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const handleSignup = async () => {
    if (!fullname || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const userInfo = await signup(fullname, email, password, setIsLoading);
      // Handle successful signup (e.g., navigate to confirmation)
      console.log(userInfo.email)
     

      // Pass data if needed
    } catch (error) {
      alert(error.message); // Display user-friendly error message
    }
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>
          <RegistrationSVG
            height={150}
            width={150}
            style={{transform: [{rotate: '-5deg'}], marginTop: 30}}
          />
        </View>

        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            textAlign: 'left',
            marginTop: 15,
            marginBottom: 50,
          }}>
          Register
        </Text>

        <View style={{flexDirection: 'row', marginBottom: 30}}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              marginHorizontal: 35,
              paddingHorizontal: 50,
              paddingVertical: 10,
            }}>
            <GoogleSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 50,
              paddingVertical: 10,
            }}>
            <FacebookSVG height={24} width={24} />
          </TouchableOpacity>
        </View>

        <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
          Or, register with email ...
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
              style={{marginRight: 5}}
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
              style={{marginRight: 5}}
            />
          }
          keyboardType="email-address"
        />

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
    inputType={passwordVisible ? "text" : "password"} 
   
    onChangeText={text => setPassword(text)}
  />
  <TouchableOpacity onPress={togglePasswordVisibility} style={{ position: 'absolute', right: 10, top: 10 }}>
    <Ionicons
      name={passwordVisible ? "eye-outline" : "eye-off-outline"}
      size={20}
      color="#666"
    />
  </TouchableOpacity>
</View>

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
    inputType={passwordVisible1 ? "text" : "password"} 
   
    onChangeText={text => setConfirmPassword(text)}
  />
  <TouchableOpacity onPress={togglePasswordVisibility1} style={{ position: 'absolute', right: 10, top: 10 }}>
    <Ionicons
      name={passwordVisible1 ? "eye-outline" : "eye-off-outline"}
      size={20}
      color="#666"
    />
  </TouchableOpacity>
</View>

        <CustomButton label={'Register'} onPress={handleSignup}  />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text style={{color: '#666'}}>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default RegisterScreen;
