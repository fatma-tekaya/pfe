import { View, Text } from 'react-native'
import React from 'react'

const SignDetailsScreen = ({navigation , route}) => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:'black'}}>Vital sign Screen</Text>
      <Text style={{color:'black'}}>{route.params?.title}</Text>
    </View>
  )
}

export default SignDetailsScreen