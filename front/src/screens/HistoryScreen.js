import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Ensure this is correctly imported
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import Entypo from 'react-native-vector-icons/Entypo';

const anomalyInfo = {
  Acne: {
    description: 'Acne is a skin condition that occurs when your hair follicles become plugged with oil and dead skin cells, leading to whiteheads, blackheads, or pimples.',
  },
  Eczema: {
    description: "Eczema, or atopic dermatitis, is a condition that makes your skin red and itchy. It's common in children but can occur at any age.",
  },
  Rosacea: {
    description: 'Rosacea is a common skin condition that causes redness and visible blood vessels in your face. It may also produce small, red, pus-filled bumps.',
  },
  'Actinic Keratosis': {
    description: 'Actinic Keratosis is a rough, scaly patch on your skin that develops from years of exposure to the sun, and can sometimes progress to skin cancer.',
  },
  'Basal Cell Carcinoma': {
    description: 'Basal Cell Carcinoma is a type of skin cancer that begins in the basal cells. It often manifests as a slightly transparent bump on the sun-exposed skin.',
  },
 
};

const HistoryScreen = ({ navigation }) => {
  const [captures, setCaptures] = useState([]);
  const { userToken, setIsLoading } = useContext(AuthContext);

  useEffect(() => {
    fetchCaptures();
  }, []);

  const fetchCaptures = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/getCaptures`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setIsLoading(false);
      const capturesWithDescriptions = response.data.map(capture => ({
        ...capture,
        description: anomalyInfo[capture.label]?.description || 'No description available.',
        imageUrl: `${BASE_URL}/${capture.path.replace(/\\/g, '/')}`,  // Ensure imageUrl is correctly set
      }));
      setCaptures(capturesWithDescriptions);
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to fetch captures:', error);
    }
  };

  const handleDelete = async (captureId) => {
    setIsLoading(true);
    try {
      await axios.delete(`${BASE_URL}/deleteCapture/${captureId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setIsLoading(false);
      fetchCaptures();  // Refresh the list after deletion
      Alert.alert('Success', 'Capture deleted successfully');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to delete capture');
      console.error('Failed to delete capture:', error);
    }
  };

  const renderItem = ({ item }) => {
    const { imageUrl, label, description, _id ,advice} = item;

    return (
      <TouchableOpacity 
        style={styles.itemContainer} 
        onPress={() => navigation.navigate('Anomaly Info', { result: item })}  // Ensure item is passed correctly
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(_id)} style={styles.deleteIcon}>
          <Entypo name="cross" size={25} color="gray" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={captures}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 10
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
    color: '#333'
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  deleteIcon: {
    marginTop: -50
  }
});

export default HistoryScreen;