import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../screens/ProfileScreen';
import MomentsScreen from '../screens/MomentsScreen';

import SettingsScreen from '../screens/SettingsScreen';
import CustomDrawer from '../components/CustomDrawer';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import TabNavigator from './TabNavigator';
import { colors } from '../styles/colors';

const Drawer = createDrawerNavigator();

const AuthStack = () => {
  return (
    <Drawer.Navigator
    drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveBackgroundColor: colors.gray_fonce,
      drawerActiveTintColor: colors.blue_fonce,
      drawerInactiveTintColor: '#333',
      drawerLabelStyle: {
        marginLeft: -25,
        fontFamily: 'Outfit-Medium',
        fontSize: 15,
      },
    }}>
      <Drawer.Screen name="Home" component={TabNavigator} options={{
        drawerIcon:({color})=>(
          <Ionicons name="home-outline" size={22} color={color}/>
        )
      }} />
     
      <Drawer.Screen name="Moments" component={MomentsScreen}  options={{
        drawerIcon:({color})=>(
          <Ionicons name="timer-outline" size={22} color={color}/>
        )
      }}/>
      <Drawer.Screen name="Settings" component={SettingsScreen}  options={{
        drawerIcon:({color})=>(
          <Ionicons name="settings-outline" size={22} color={color}/>
        )
      }}/>
    </Drawer.Navigator>
  );
};

export default AuthStack;