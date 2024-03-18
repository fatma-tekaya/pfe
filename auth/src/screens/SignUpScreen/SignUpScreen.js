import { View, ScrollView , StyleSheet, useWindowDimensions, Text } from 'react-native'
import React , {useState} from 'react'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; 

const SignUpScreen = () => {
    const [fullname , setFullname]=useState('')
    const [email , setEmail]=useState('')
    const [password , setPassword]=useState('')
    const [confirmPassword , setConfirmPassword]=useState('')
    const navigation = useNavigation();
    
    const onRegisterPressed = async () => {
      try {
        // Check if passwords match
        if (password !== confirmPassword) {
          console.warn('Passwords do not match');
          return;
        }
  
        // Send a request to your backend to create a new user
        const response = await axios.post('http://192.168.1.19:5000/create-user', {
          fullname: fullname,
          email,
          password,
          confirmPassword,
        });
  
         // Handle success response
         if (response.status === 200) {
          console.log('User registered successfully:', response.data);
  
          // Navigate to the next screen (e.g., ConfirmEmail)
          navigation.navigate('HomeScreen');
        } else {
          console.error('Failed to register user:', response.data);
        }
      } catch (error) {
        // Handle error
        console.error('Error registering user:', error);
      }
    };
    
    const onSignInPressed = () =>{
        console.warn("Sign In");
        navigation.navigate('SignIn');
      }
    const onTermsOfUsePressed= () =>{
        console.warn("Terms Of Use");
      }
    const onPrivacyPolicyPressed= () =>{
        console.warn("Privacy Policy");
      }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.root}>
      <Text style={styles.title}>Create an account</Text>
      <CustomInput placeholder="Fullname" value={fullname.toString()} setValue={setFullname}/>
      <CustomInput placeholder="Email" value={email.toString()} setValue={setEmail}/>
      <CustomInput placeholder="Password" value={password.toString()} setValue={setPassword} secureTextEntry={true}/>
      <CustomInput placeholder="Repeat Password" value={confirmPassword.toString()} setValue={setConfirmPassword} secureTextEntry={true}/>

    <CustomButton text="Register"
     onPress={onRegisterPressed}/>
    <Text style={styles.text}>
    By registering, you confirm that you accept our {' '} 
    <Text style={styles.link} onPress={onTermsOfUsePressed}>Terms of Use  </Text>
    and {' '}<Text style={styles.link} onPress={onPrivacyPolicyPressed}>Privacy Policy</Text>
    </Text>
      <SocialSignInButtons/>
      <CustomButton text="Have an account? Sign in"
     onPress={onSignInPressed}
     type= "TERTIARY"/>
    </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    root:{
        alignItems:'center',
        padding:40,
    },
    title:{
        fontSize:24,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
    },
    text:{
        color:'gray',
        marginVertical:10,
    },
    link:{
        color:"#FDB075",
    },
})
export default SignUpScreen