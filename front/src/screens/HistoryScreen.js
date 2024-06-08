import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Ensure this is correctly imported
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';

const HistoryScreen = ({ navigation }) => {
  const [captures, setCaptures] = useState([]);
  const { userToken, setIsLoading } = useContext(AuthContext);

  useEffect(() => {
    console.log("hellooo")
    fetchCaptures();
  }, []);

  const fetchCaptures = async () => {
    setIsLoading(true);
    try {
      console.log("hellooo222")

      const response = await axios.get(`${BASE_URL}/getCaptures`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log("finitoooo",response)
      setIsLoading(false);
      setCaptures(response.data);
    

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
    const imageUrl = `${BASE_URL}/${item.path.replace(/\\/g, '/')}`;

    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{item.label}</Text>
          <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteIcon}>
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: 18,
    color: '#333'
  },
  deleteIcon: {
    marginLeft: 10
  }
});

export default HistoryScreen;