import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { useRoute } from '@react-navigation/native';

const ConfirmationSentScreen = ({navigation,route }) => {
  
  
  const { email } = route.params;
  console.log("Email received in ConfirmationSentScreen:", email);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20, color:'black' }}>
        Your confirmation mail is sent successfully to {email}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ color: '#2F4F4F', fontSize: 18 }}>Please Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmationSentScreen;
