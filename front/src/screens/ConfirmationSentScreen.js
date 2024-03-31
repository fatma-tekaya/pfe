import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LoginScreen from './LoginScreen';

const ConfirmationSentScreen = ({ navigation }) => {
 

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Your confirmation mail is sent successfully.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate(LoginScreen)}>
        <Text style={{ color: 'blue', fontSize: 18 }}>Please Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmationSentScreen;
