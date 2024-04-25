import React ,{useContext, useState}from 'react';
import { View, Text, TouchableOpacity,SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { useRoute } from '@react-navigation/native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

const ConfirmationSentScreen = ({navigation,route }) => {
  
  const[verificationCode,setVerificationCode]=useState(null)
  const { email } = route.params;
  const {confirm } = useContext(AuthContext);
  const handleConfirm = async () => {
    try {
      if (!verificationCode) {
        alert('Please enter the verification code!');
        return;
      }
      
      // Appel de la fonction de confirmation avec la méthode POST
      const response = await confirm(verificationCode);
      
      // Vérification de la réponse du backend
      if (response!== undefined && response !== null) {
        console.log('User verified!');
        navigation.navigate('Success', { email });
      } else {
        alert('Invalid code!');
      }
    } catch (error) {
      console.error(error);
      alert('Error confirming verification code!');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ paddingHorizontal: 25 }}>
        <Text style={{ fontSize: 20, marginBottom: 20, color: 'black' }}>
          Your confirmation mail has been sent successfully to {email}
        </Text>
        <Text>Please enter the received verification code</Text>
        <InputField
          label={'Verification Code'}
          value={verificationCode}
          onChangeText={text => setVerificationCode(text)}
        />
        <CustomButton label={"Send"} onPress={handleConfirm} />
      </View>
    </SafeAreaView>
  );
};

export default ConfirmationSentScreen;
