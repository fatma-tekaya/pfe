import { View, ScrollView , StyleSheet, useWindowDimensions, Text } from 'react-native'
import React , {useState} from 'react'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
    const [username , setUsername]=useState('')
    const navigation = useNavigation();
    const onSignInPressed = () =>{
        console.warn("Sign In");
        navigation.navigate('SignIn');
      }
      const onSendPressed = () =>{
        console.warn("Send");
        navigation.navigate('NewPassword');
      }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.root}>
      <Text style={styles.title}>Reset your password</Text>
      <CustomInput placeholder="Username" value={username} setValue={setUsername}/>
    <CustomButton text="Send"
     onPress={onSendPressed}/>

      <CustomButton text="Back to Sign in"
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
export default ForgotPasswordScreen