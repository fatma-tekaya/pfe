// ConfirmationSentScreen.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 

const ConfirmationSentScreen = ({navigation, route }) => {
  const { email } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Your confirmation mail is sent successfully to {email}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ color: 'blue', fontSize: 18 }}>Please Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmationSentScreen;
