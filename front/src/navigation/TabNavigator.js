import React , { useState, useEffect, useContext }from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NotifScreen from '../screens/NotifScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignDetailsScreen from '../screens/SignDetailsScreen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthContext } from '../context/AuthContext';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = () => {
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignDetails"
        component={SignDetailsScreen}
        options={({route}) => ({
          title: route.params.title,
        })}
      />
    </Stack.Navigator>
  );
};
const TabNavigator = () => {
  const { userInfo } = useContext(AuthContext);
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    let unsubscribe = null;

    const fetchNotifications = (userId) => {
      unsubscribe = firestore()
        .collection('notifications')
        .where('userId', '==', userId)
        .where('seen', '==', false)
        .onSnapshot(snapshot => {
          setUnseenCount(snapshot.size);
        });
    };

    const fetchUserId = async () => {
      try {
        const snapshot = await database()
          .ref('users')
          .orderByChild('email')
          .equalTo(userInfo.user.email)
          .once('value');

        if (snapshot.exists()) {
          const userId = Object.keys(snapshot.val())[0];
          fetchNotifications(userId);
        } else {
          console.error('No user found with the provided email.');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    if (userInfo.user.email) {
      fetchUserId();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userInfo]);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {backgroundColor: '#2F4F4F'},
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: 'yellow',
      }}>
      <Tab.Screen
        name="Home2"
        component={HomeStack}
        options={({route}) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: '#2F4F4F',
          },
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        })}
      />
   
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Feather name="camera" color={color} size={size} />
          ),
        }}
      />
         <Tab.Screen
        name="Notif"
        options={{
          tabBarBadge: unseenCount > 0 ? unseenCount : null,
          tabBarBadgeStyle: {backgroundColor: 'yellow'},
          tabBarIcon: ({color, size}) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      >{props => <NotifScreen {...props} setUnseenCount={setUnseenCount} />}
      </Tab.Screen>
       <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const getTabBarVisibility = route => {
  console.log(route);
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
  console.log(routeName);
  if (routeName == 'GameDetails') {
    return 'none';
  }
  return 'flex';
};

export default TabNavigator;
