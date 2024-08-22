import React, { useState, useEffect, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotifScreen from '../screens/NotifScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignDetailsScreen from '../screens/SignDetailsScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';
import ConversationsListScreen from '../screens/ConversationsListScreen';
import ConversationScreen from '../screens/ConversationScreen';
import SkinDetails from '../screens/SkinDetails';
import HistoryScreen from '../screens/HistoryScreen';
import { AuthContext } from '../context/AuthContext';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import { colors } from '../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MomentsScreen from '../screens/MomentsScreen';
import DoctorsScreen from '../screens/ListdoctorScreen';
const getHeaderVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'defaultRoute';
  if (routeName === 'defaultRoute' || routeName === 'AnotherScreenWithoutHeader') {
    return false;
  }
  return true;
};
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MessagesStack = createNativeStackNavigator();
const FavoriteStack = createNativeStackNavigator();
DoctorsStack= createNativeStackNavigator();

const FavoriteStackNavigator = () => (
  <FavoriteStack.Navigator>
    <FavoriteStack.Screen name="Favorite" component={FavoriteScreen}
      options={{
        headerShown: true, title: 'Skin Anomalies', headerTitleStyle: {
          fontFamily: 'Outfit-Medium',
          fontSize: 20
        }
      }} />
      
    <FavoriteStack.Screen name="History" component={HistoryScreen}
      options={{
        headerShown: true, title: 'History', headerTitleStyle: {
          fontFamily: 'Outfit-Medium',
          fontSize: 20
        }
      }} />
    <FavoriteStack.Screen name="Anomaly Info" component={SkinDetails} options={{
      title: 'Anomaly Info', headerTitleStyle: {
        fontFamily: 'Outfit-Medium',
        fontSize: 20
      }
    }} />
  </FavoriteStack.Navigator>
);
const MessagesStackNavigator = () => (
  <MessagesStack.Navigator>
    <MessagesStack.Screen
      name="ConversationsList"
      component={ConversationsListScreen}
      options={{
        headerShown: true, title: 'Conversations', headerTitleStyle: {
          fontFamily: 'Outfit-Medium',
          fontSize: 20
        }
      }}
    />
    <MessagesStack.Screen
      name="Conversation"
      component={ConversationScreen}
      options={({ route }) => ({ title: route.params.conversationTitle })}
    />

  </MessagesStack.Navigator>
);

const DoctorsStackNavigator = () => (
  <DoctorsStack.Navigator>
   <DoctorsStack.Screen
      name="Specialities"
      component={MomentsScreen}
      options={{
      //  headerShown: true,
        title: 'Specialities',
        headerTitleStyle: {
          fontFamily: 'Outfit-Medium',
          fontSize: 20,
        //  color: colors.blue_fonce
        },
      }}
    />
    <DoctorsStack.Screen
      name="Doctors List"
      component={DoctorsScreen}
      options={({ route }) => ({
        //headerShown: true,
        title: `${route.params.specialty}`,  // Dynamically setting the title based on the passed specialty
        headerTitleStyle: {
          fontFamily: 'Outfit-Medium',
          fontSize: 20,
         // color: colors.blue_fonce
        },
      })}
    />

  </DoctorsStack.Navigator>
);

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignDetails"
        component={SignDetailsScreen}
        options={({ route }) => ({
          title: route.params.title,
        })}
      />
       <Stack.Screen
       name="Doctors" 
       component={DoctorsStackNavigator}
       options={({ route }) => ({ headerShown: false })} 
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const { userInfo } = useContext(AuthContext);
  const [unseenCount, setUnseenCount] = useState(0);

  
  useEffect(() => {
    let unsubscribe = null; // Définir ici pour assurer la portée dans le nettoyage

    const fetchUserId = async () => {
      if (userInfo && userInfo.user && userInfo.user.email) {
        try {
          const snapshot = await database()
            .ref('patients')
            .orderByChild('email')
            .equalTo(userInfo.user.email)
            .once('value');

          if (snapshot.exists()) {
            const userId = Object.keys(snapshot.val())[0];
            // Déplacer l'abonnement Firestore ici à l'intérieur de la portée de userId
            unsubscribe = firestore()
              .collection('notifications')
              .where('userId', '==', userId)
              .where('seen', '==', false)
              .onSnapshot(snapshot => {
                setUnseenCount(snapshot.size);
              });
          }
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      }
    };

    fetchUserId();

    // Retourner la fonction de nettoyage directement depuis useEffect
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Nettoyer l'abonnement lors du démontage du composant
      }
    };
  }, [userInfo]);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: colors.initial },
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: colors.blue_fonce,
      }}>
      <Tab.Screen
        name="Home2"
        component={HomeStack}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: colors.gray_fonce,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        })}
      />

      <Tab.Screen
        name="Messages"
        component={MessagesStackNavigator}
        options={{
          tabBarStyle: {
            backgroundColor: colors.gray_fonce,
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="robot-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favorite1"
        component={FavoriteStackNavigator}
        options={{
          tabBarStyle: {
            backgroundColor: colors.gray_fonce,
          },
          tabBarIcon: ({ color, size }) => (
            <Feather name="camera" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        options={{
          headerTitleStyle: {
            fontFamily: 'Outfit-Medium',
            fontSize: 20
          },
          headerShown: true,
          tabBarStyle: {
            backgroundColor: colors.gray_fonce,
          },

          tabBarBadge: unseenCount > 0 ? unseenCount : null,
          tabBarBadgeStyle: { backgroundColor: 'yellow' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      >{props => <NotifScreen {...props} setUnseenCount={setUnseenCount} />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          tabBarStyle: {
            backgroundColor: colors.gray_fonce,
          },
          tabBarIcon: ({ color, size }) => (
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