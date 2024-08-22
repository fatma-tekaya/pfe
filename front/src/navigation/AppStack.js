import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MomentsScreen from '../screens/MomentsScreen';
import DoctorsScreen from '../screens/ListdoctorScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomDrawer from '../components/CustomDrawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';


import TabNavigator from './TabNavigator';
import { colors } from '../styles/colors';
const DoctorsStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
// const DoctorsStackNavigator = () => (
//   <DoctorsStack.Navigator>
//     <DoctorsStack.Screen
//       name="Specialities"
//       component={MomentsScreen}
//       options={{
//         headerShown: false,
//         title: 'Specialities',
//         headerTitleStyle: {
//             fontFamily: 'Outfit-Medium',
//             fontSize: 20,
//             color:colors.blue_fonce
//           },
//       }}
//     />
//     <DoctorsStack.Screen
//       name="Doctors List"
//       component={DoctorsScreen}
//       options={{
//         headerShown: false,
//         title: 'Doctors List',
//         headerTitleStyle: {
//             fontFamily: 'Outfit-Medium',
//             fontSize: 20,
//             color:colors.blue_fonce
//           },
//       }}
//       //options={({ route }) => ({ title: route.params.speciality })}
//     />

//   </DoctorsStack.Navigator>
// );
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
        drawerIcon: ({ color }) => (
          <Ionicons name="home-outline" size={22} color={color} />
        )
      }} />

      {/* <Drawer.Screen name="Doctors" component={DoctorsStackNavigator} options={{
        drawerIcon: ({ color }) => (
          <Icon name="user-doctor" size={22} color={color} />
        ),  
        headerShown: true,

      }} /> */}
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{
        drawerIcon: ({ color }) => (
          <Ionicons name="settings-outline" size={22} color={color} />
        ),
        headerShown: true,
        
        title: 'Settings',
        headerTitleStyle: {
            fontFamily: 'Outfit-Medium',
            fontSize: 20,
            color:colors.blue_fonce
          },
      }} />
    </Drawer.Navigator>
  );
};

export default AuthStack;