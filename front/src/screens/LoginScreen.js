import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
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

const LoginScreen = ({navigation}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {login, setIsLoading, signInWithGoogle} = useContext(AuthContext);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>
          {/* <LoginSVG
            height={220}
            width={220}
            style={{transform: [{rotate: '-5deg'}]}}
          /> */}
          <Image source={require('../assets/images/logosans.png')}/>
        </View>

        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#4a6475',
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <InputField
            label={'Password'}
            value={password}
            icon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={{marginRight: 5}}
              />
            }
            inputType={passwordVisible ? 'text' : 'password'}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{position: 'absolute', right: 10, top: 10}}>
            <Ionicons
              name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Forgot');
          }}>
          <Text
            style={{color: '#0f3f61', fontWeight: '700', textAlign: 'center', marginBottom:10}}>
            {' '}
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <CustomButton
          label={'Login'}
          onPress={() => {
            login(email, password, setIsLoading);
          }}
        />

        <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
          Or, login with ...
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center', // Alignez les éléments verticalement au centre
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {
              signInWithGoogle();
            }}
            style={{
              flexDirection: 'row', // Permet d'aligner l'icône et le texte horizontalement
              alignItems: 'center', // Alignez les éléments verticalement au centre
              borderColor: '#ddd',
              backgroundColor:'lightgrey',
              borderWidth: 2,
              borderRadius: 10,
              marginHorizontal: 75,
              paddingHorizontal: 10, // Ajustez selon votre besoin
              paddingVertical: 10,
            }}>
            <GoogleSVG height={24} width={24} />
            <Text style={{marginLeft: 10 , color:'black'}}>Se connecter avec Gmail</Text>
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
            <Text style={{color: '#0f3f61', fontWeight: '700'}}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
