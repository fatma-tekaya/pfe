import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';
import { AuthContext } from '../context/AuthContext';
import CustomLoader from './CustomLoader';
import { BASE_URL } from '../config';
import axios from 'axios';

const CustomDrawer = props => {
  const { logout, userInfo, userToken } = useContext(AuthContext);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the current user rating from the backend
    const fetchUserFeedback = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user-feedback`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        if (response.data.success && response.data.appRating !== undefined) {
          setUserRating(response.data.appRating);
        }
      } catch (error) {
        console.error('Error fetching user feedback:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFeedback();
  }, [userToken]);

  const handleRatingChange = useCallback((rating) => {
    console.log('Rating Changed:', rating); // Log the change for debugging
    setUserRating(rating); // Update the state to the new rating
  }, []);

  const handleRatingCompleted = useCallback((rating) => {
    console.log('Final Rating:', rating); // Log the final rating for debugging

    const sendRatingToServer = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/rate-app`, {
          appRating: rating
        }, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        if (response.data.success) {
          console.log('Rating submitted successfully:', response.data);
          alert('Rating updated successfully!');
        } else {
          alert('Failed to update rating.');
        }
      } catch (error) {
        console.error('Error submitting rating:', error);
        alert('Error updating rating. Please try again.');
      }
    };

    sendRatingToServer(); // Call the async function to send the rating to the server
  }, [userToken]);

  if (!userInfo || loading) {
    return <CustomLoader />;
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#f0f0f0' }}>
        <ImageBackground
          source={require('../assets/images/bcg.jpg')}
          style={{ padding: 20, alignItems: 'center' }}>
          <Image
            source={userInfo.user.avatar ? { uri: userInfo.user.avatar } : require('../assets/images/user-profile.jpg')}
            style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
          />
          <Text style={{ fontSize: 18, fontFamily: 'Outfit-Medium' }}>
            {userInfo.user.fullname}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Outfit-Regular', marginRight: 5 }}>
              Welcome to your account
            </Text>
            <Ionicons name="happy-outline" size={16} style={{ marginTop: 3 }} />
          </View>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity style={{ paddingBottom: 15, paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="star-outline" size={22} color="black" />
          <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 15, color: 'black', marginLeft: 4 }}>
            Rate the App
          </Text>
        </View>
        <Rating
          onRating={handleRatingChange}  // Capture every rating change
          onFinishRating={handleRatingCompleted}  // Send the final rating to the server
          imageSize={30}
          style={{ paddingVertical: 10 }}
          startingValue={userRating}  // Reflects the current user rating
          ratingColor="#FFD700"
          ratingBackgroundColor="#c8c7c8"
        />
      </TouchableOpacity>
      <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: '#ccc', marginBottom: 5 }}>
        <TouchableOpacity onPress={logout} style={{ paddingVertical: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="exit-outline" size={22} color="black" />
            <Text style={{ color: 'black', fontSize: 15, fontFamily: 'Outfit-Medium', marginLeft: 5 }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
