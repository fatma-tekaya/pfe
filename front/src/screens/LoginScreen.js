import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginSVG from '../assets/images/log.svg';
import GoogleSVG from '../assets/images/misc/google.svg';
import FacebookSVG from '../assets/images/misc/facebook.svg';
import TwitterSVG from '../assets/images/misc/twitter.svg';
import {LoginButton} from 'react-native-fbsdk-next';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import {AuthContext} from '../context/AuthContext';
import {signInWithGoogle} from '../config/firebase/GoogleSignin';

const LoginScreen = ({navigation}) => {
  async function googleSignin() {
    signInWithGoogle().then(data => {
      if (!data) {
        console.log('no data');
      }
      console.log('success data', data);
    });
  }

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {login, loginWithFacebook,setIsLoading} = useContext(AuthContext);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>
          <LoginSVG
            height={220}
            width={220}
            style={{transform: [{rotate: '-5deg'}]}}
          />
        </View>

        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Login
        </Text>

        <InputField
          label={'Email'}
          value={email}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
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
<TouchableOpacity  
    onPress={() => {
      navigation.navigate('Forgot');
    }}>
      <Text style={{color: '#AD40AF', fontWeight: '700',textAlign:'center'}}> Forgot Password?</Text>
</TouchableOpacity>
        <CustomButton
          label={'Login'}
          onPress={() => {
            login(email, password,setIsLoading);
          }}
        />

        <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
          Or, login with ...
        </Text>

        <View
          style={{
            flexDirection: 'row',
            //justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {
              googleSignin();
            }}
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
            onPress={() => loginWithFacebook()}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              marginHorizontal: 35,
              paddingHorizontal: 50,
              paddingVertical: 10,
            }}>
            <FacebookSVG height={24} width={24} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text style={{color: '#666'}}>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
