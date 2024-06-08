import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, { useContext } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../context/AuthContext';
import CustomLoader from './CustomLoader'

const CustomDrawer = props => {
  const { logout, setIsLoading } = useContext(AuthContext);
  const { userInfo } = useContext(AuthContext);
  if (!userInfo) {
    return <CustomLoader />; // or some other placeholder content until userInfo is loaded
  }

  // Now safe to use userInfo
  console.log(userInfo.user);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: '#D3D3D3' }}>
        <ImageBackground
          source={require('../assets/images/bcg.jpg')}
          style={{ padding: 25 }}>
          <Image
            source={
              userInfo.user.avatar
                ? { uri: userInfo.user.avatar }
                : require('../assets/images/user-profile.jpg')
            }
            style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
          />

          <Text style={{ fontSize: 18, fontFamily: 'Outfit-Medium', }}>
            {userInfo.user.fullname}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontFamily: 'Outfit-Regular', marginRight: 5 }}>
              {' '}
              Welcome to your account{' '}
            </Text>
            <Ionicons name="happy-outline" size={14} style={{ marginTop: 3 }} />
          </View>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="share-social-outline" size={22} color="black" />
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontFamily: 'Outfit-Medium',
                marginLeft: 5,
              }}>
              Tell a Friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            logout();
          }}
          style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="exit-outline" size={22} color="black" />
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontFamily: 'Outfit-Medium',
                marginLeft: 5,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
