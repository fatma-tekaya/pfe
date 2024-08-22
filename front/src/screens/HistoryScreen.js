import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Ensure this is correctly imported
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from '../styles/colors';

const anomalyInfo = {
  Acne: {
    description: 'Acne is a skin condition that occurs when your hair follicles become plugged with oil and dead skin cells, leading to whiteheads, blackheads, or pimples.',
    advice: 'Keep your face clean, avoid popping pimples, and use non-comedogenic makeup.',
    moreInfoUrl: 'https://www.google.nl/',
  },
  Eczema: {
    description: "Eczema, or atopic dermatitis, is a condition that makes your skin red and itchy. It's common in children but can occur at any age.",
    advice: 'Moisturize regularly, avoid harsh soaps and detergents, and consider using a humidifier in dry weather.',
    moreInfoUrl: 'https://www.google.nl/',
  },
  Rosacea: {
    description: 'Rosacea is a common skin condition that causes redness and visible blood vessels in your face. It may also produce small, red, pus-filled bumps.',
    advice: 'Avoid triggers like hot drinks, spicy foods, and alcohol. Use gentle skin care products and consider medical therapies if symptoms persist.',
    moreInfoUrl: 'https://www.google.nl/',
  },
  'Actinic Keratosis': {
    description: 'Actinic Keratosis is a rough, scaly patch on your skin that develops from years of exposure to the sun, and can sometimes progress to skin cancer.',
    advice: 'Seek shade, wear sun-protective clothing, and apply sunscreen regularly.',
    moreInfoUrl: 'https://www.google.nl/',
  },
  'Basal Cell Carcinoma': {
    description: 'Basal Cell Carcinoma is a type of skin cancer that begins in the basal cells. It often manifests as a slightly transparent bump on the sun-exposed skin.',
    advice: 'Consult a dermatologist for potential treatment options such as surgical removal or topical treatments.',
    moreInfoUrl: 'https://www.google.nl/',
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
         advice: anomalyInfo[capture.label]?.advice || 'No advice available.',
        imageUrl: `${BASE_URL}/${capture.path.replace(/\\/g, '/')}`,  
        createdAt: new Date(capture.timestamp).toLocaleDateString() + ' ' + new Date(capture.timestamp).toLocaleTimeString(), // Formatting timestamp
       
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
          <Text style={styles.timestamp}>{item.createdAt}</Text>
       
        <TouchableOpacity onPress={() => handleDelete(_id)} style={styles.deleteIcon}>
          <Entypo name="cross" size={25} color="gray" />
        </TouchableOpacity>
        </View>
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
  //  padding: 10,
  paddingTop:16,
  backgroundColor: colors.background,
  },
  itemContainer: {
    borderRadius: 8,
    color:'#888',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
   position: 'relative',


    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    paddingVertical: 18,
    marginVertical: 5,
    marginHorizontal: 10,
      // position: 'relative',
    minHeight: 60,
   // height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 70,
    height: 70,
   // borderRadius: 35,  // Rendre l'image circulaire
    marginRight: 10
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',  // Centrer verticalement le contenu à l'intérieur
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',  // Rendre le texte plus lisible
    color: '#333'
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4
  },
  deleteIcon: {
    position: 'absolute',
    right: 0,  // Ajuster la position à droite
    top: -12,    // Ajuster la position en haut
  }
});


export default HistoryScreen;