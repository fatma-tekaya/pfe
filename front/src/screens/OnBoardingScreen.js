import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/colors';



const OnBoardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../assets/images/screen.png')} />
      </View>
      <View style={{
        marginTop: 30,
        marginBottom: 20,
      }}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Outfit-Medium',
            fontSize: 20,
            color: '#20315f',
            marginHorizontal: 20,

          }}>
          Welcome to your health home assistant
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: colors.bleu_bleu,
          padding: 12,
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
            fontFamily: 'Outfit-Regular',
          }}>
          Let's Start
        </Text>
        <MaterialIcons name="arrow-forward" size={22} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
export default OnBoardingScreen;