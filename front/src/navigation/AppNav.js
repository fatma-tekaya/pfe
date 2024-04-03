import { View, Text, ActivityIndicator } from 'react-native'
import React ,{useContext} from 'react'
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { AuthContext } from '../context/AuthContext';

const AppNav = () => {
    const {isLoading,userToken}=useContext(AuthContext);
    if (isLoading) {
        return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
            <ActivityIndicator size={'large'}/>
            <Text style={{color:'black'}}> wasaa baleek</Text>
        </View>);
    }
  return (
    <NavigationContainer >
    {userToken !== null ? <AppStack /> : <AuthStack />}
  </NavigationContainer>
  )
}

export default AppNav