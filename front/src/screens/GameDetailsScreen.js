import { View, Text } from 'react-native'
import React from 'react'

const GameDetailsScreen = ({navigation , route}) => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:'black'}}>Game Details Screen</Text>
      <Text style={{color:'black'}}>{route.params?.title}</Text>
    </View>
  )
}

export default GameDetailsScreen