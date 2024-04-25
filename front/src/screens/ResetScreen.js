import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'

const ResetScreen = ({navigation , route}) => {
  const { email } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20, color:'black' }}>
        Your Password has been updated successfully {email}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ color: '#2F4F4F', fontSize: 18 }}>Please Login</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ResetScreen