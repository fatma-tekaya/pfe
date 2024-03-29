import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity,Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GamingImg from '../assets/images/bord.jpg'



const OnBoardingScreen = ({navigation}) => {
  return (
  <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <View style={{marginTop: 30}}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            fontWeight: 'bold',
            fontSize: 30,
            color: '#20315f',
          }}>
          GAMEON
        </Text>
      </View>
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
    <Image source={require('../assets/images/bord.jpg')} width={100} height={100} />
    </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#AD40AF',
          padding: 20,
          width: '90%',
          borderRadius: 10,
          marginBottom: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onPress={() => navigation.navigate('Login')}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
            fontFamily: 'Roboto-MediumItalic',
          }}>
          Let's Discover
        </Text>
         <MaterialIcons name="arrow-forward" size={22} color="#fff" /> 
      </TouchableOpacity>
    </SafeAreaView>
  )
}
export default OnBoardingScreen;