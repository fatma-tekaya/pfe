import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NotifScreen from '../screens/NotifScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignDetailsScreen from '../screens/SignDetailsScreen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import MessagesScreen from '../screens/ConversationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ConversationsListScreen from '../screens/ConversationsListScreen';
import ConversationScreen from '../screens/ConversationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const MessagesStack = createNativeStackNavigator();
const MessagesStackNavigator = () => (
  <MessagesStack.Navigator>
    <MessagesStack.Screen
      name="ConversationsList"
      component={ConversationsListScreen}
      options={{ headerShown: true, title: 'Conversations' }}
    />
    <MessagesStack.Screen
      name="Conversation"
      component={ConversationScreen}
      options={({ route }) => ({ title: route.params.conversationTitle })}
    />
    
  </MessagesStack.Navigator>
);

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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {backgroundColor: '#0f3f61'},
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: 'yellow',
      }}>
      <Tab.Screen
        name="Home2"
        component={HomeStack}
        options={({route}) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: '#0f3f61',
          },
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        })}
      />
   
   

<Tab.Screen
        name="Messages"
        component={MessagesStackNavigator} // Updated to use stack navigator
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-ellipses-outline" color={color} size={size} /> 
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
        component={NotifScreen}
        options={{
          tabBarBadge: 3,
          tabBarBadgeStyle: {backgroundColor: 'yellow'},
          tabBarIcon: ({color, size}) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      />
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
