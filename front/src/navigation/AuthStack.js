import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnBoardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ConfirmationSentScreen from '../screens/ConfirmationSentScreen';
import ForgotScreen from '../screens/ForgotScreen';
import CodeScreen from '../screens/CodeScreen';
import ResetScreen from '../screens/ResetScreen';
import SuccessScreen from '../screens/SuccessScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Forgot" component={ForgotScreen}/>
      <Stack.Screen name='Code' component={CodeScreen}/>
      <Stack.Screen name='Reset' component={ResetScreen}/>
      <Stack.Screen name='Register' component={RegisterScreen} /> 
      <Stack.Screen name='Confirmation' component={ConfirmationSentScreen} /> 
      <Stack.Screen name='Success' component={SuccessScreen} /> 

    </Stack.Navigator>

    
  );
};

export default AuthStack;