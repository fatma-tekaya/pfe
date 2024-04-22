import React ,{useState}from 'react';
import { View, Text, TouchableOpacity,SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { useRoute } from '@react-navigation/native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

const ConfirmationSentScreen = ({navigation,route }) => {
  
  const[code,setCode]=useState(null)
  const { email } = route.params;

  console.log("Email received in ConfirmationSentScreen:", email);
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
    <View style={{paddingHorizontal: 25}}>
      <Text style={{ fontSize: 20, marginBottom: 20, color:'black' }}>
        Your confirmation mail is sent successfully to {email}
      </Text>
      <Text>Please enter the recived code </Text>
      <InputField
          label={'Code'}
          value={code}
       
          onChangeText={text=>setCode(text)}
        />
         <CustomButton label={"Send"} onPress={() => {navigation.navigate('Success')}} />

    </View>
    </SafeAreaView>
  );
};

export default ConfirmationSentScreen;
