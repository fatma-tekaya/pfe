import { View, ScrollView ,Image, StyleSheet, useWindowDimensions } from 'react-native'
import React , {useState} from 'react'
import logo from '../../../assets/images/logo.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
    const [username , setUsername]=useState('')
    const [password , setPassword]=useState('')
    const{height}=useWindowDimensions();
    const navigation = useNavigation();

    const onSignInPressed = () =>{
      console.warn("Sign in");
      //validate user mel back
      navigation.navigate('HomeScreen');
    }
    const onForgotPasswordPressed = () =>{
      console.warn("Forgot Password");
      navigation.navigate('ForgotPassword');
    }
    const onSinUpPressed = () =>{
      console.warn("Sign Up");
      navigation.navigate('SignUp');
    }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.root}>
      <Image source={logo} style={[styles.logo, {height:height*0.3 }]} resizeMode='contain'/>
      <CustomInput placeholder="Username" value={username} setValue={setUsername}/>
      <CustomInput placeholder="Password" value={password} setValue={setPassword}
      secureTextEntry={true}/>
    <CustomButton text="Sign In"
     onPress={onSignInPressed}/>
    <CustomButton text="Forgot Password?"
     onPress={onForgotPasswordPressed}
     type= "TERTIARY"/>
      <SocialSignInButtons/>
      <CustomButton text="Don't have an account? Create one"
     onPress={onSinUpPressed}
     type= "TERTIARY"/>
    </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        backgroundColor:'white',
        padding:40,
    },
    logo:{
        width:'70%',
        maxWidth:300,
        maxHeight:200,
        backgroundColor:'white',
    }
})
export default SignInScreen