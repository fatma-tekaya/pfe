import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Carousel from 'react-native-snap-carousel';
import { tipsAndAdvices, healthTracker, sliderData } from '../model/data';
import BannerSlider from '../components/BannerSlider';
import { windowWidth } from '../utils/Dimensions';
import CustomSwitch from '../components/CustomSwitch';
import ListItem from '../components/ListItem';
import { AuthContext } from '../context/AuthContext';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomLoader from '../components/CustomLoader'; import SigneVitauxScreen from '../screens/SigneVitauxScreen';
import { requestUserPermission, getToken, saveTokenToServer } from '../utils/FirebaseMessagingService';
import messaging from '@react-native-firebase/messaging';
import { colors } from '../styles/colors'
const HomeScreen = ({ navigation }) => {
  const [swipeTab, setSwipeTab] = useState(1);
  const { userInfo } = useContext(AuthContext);
 
 
  useEffect(() => {
    requestUserPermission();
    if (userInfo && userInfo.user) {
      const userEmail = userInfo.user.email;
      getToken(userEmail);
       //traiter les messages FCM en arrière-plan
      messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', JSON.stringify(remoteMessage));
       });
      // Handle FCM messages
      const unsubscribe = messaging().onTokenRefresh(token => {
        console.log('FCM Token refreshed:', token);
        saveTokenToServer(token, userEmail);
      });

      return () => unsubscribe();
    }
  }, [userInfo]);  // Depend on userInfo
  const renderBanner = ({ item, index }) => {
    return <BannerSlider data={item} />;
  };
  const onSelectSwitch = (value) => {
    setSwipeTab(value)
  }
  if (!userInfo) {
    return <CustomLoader />;
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ padding: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            marginTop: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Entypo name='menu' color='black' size={30} style={{ width: 50, height: 50, marginTop: 4 }} />
            </TouchableOpacity>
            <Text
              style={{
                color: 'black',
                fontSize: 21,
                fontFamily: 'Outfit-Medium',
                marginTop: 5,

              }}>
              Hello {userInfo.user.fullname}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={
                userInfo.user.avatar || userInfo.user.photo
                  ? { uri: userInfo.user.avatar || userInfo.user.photo }
                  : require('../assets/images/user-profile.jpg')
              }
              style={{ width: 50, height: 50, marginTop: -3 }}
              imageStyle={{ borderRadius: 25 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 8,
          }}>
          <Text
            style={{color: 'black', fontSize: 18, fontFamily: 'Roboto-Medium'}}>
            Explore Our Features
          </Text>
          <TouchableOpacity onPress={() => {navigation.navigate('Doctors')}}>
            <Text style={{color: '#0aada8',marginBottom:5}}>Search for a Doctor</Text>
          </TouchableOpacity>
        </View>

        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={sliderData}
          renderItem={renderBanner}
          sliderWidth={windowWidth - 40}
          itemWidth={300}
          loop={true}
        />

        <View style={{
          marginVertical: 20,
        }}>
          <CustomSwitch
            selectionMode={1}
            option1="Health Tracker"
            option2="Tips and Advices"
            onSelectSwitch={onSelectSwitch}
          />
        </View>
        {swipeTab === 1 && (
          <View>
            <SigneVitauxScreen />
          </View>
        )}
        <View style={{ marginBottom: 20 }}>
          {swipeTab == 2 && tipsAndAdvices.map(item => (
            <ListItem key={item.id}
              photo={item.poster[0]}
              title={item.title}
              subTitle={item.subtitle}
              onPress={() => navigation.navigate('SignDetails',
                { title: item.subtitle, id: item.id })} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  separator: {
marginHorizontal:-50,
marginTop:-15,
marginBottom:10,
    height: 1,
    backgroundColor: '#d3d3d3',
    width:{windowWidth },
  },

});

export default HomeScreen;