import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MessagesScreen from './MessagesScreen';
import ConversationsScreen from './ConversationsScreen';

const Stack = createStackNavigator();

export default function ConvStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ConversationsScreen">
        <Stack.Screen name="ConversationsScreen" component={ConversationsScreen} options={{ title: 'Conversations' }} />
        <Stack.Screen name="MessagesScreen" component={MessagesScreen} options={{ title: 'Messages' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
