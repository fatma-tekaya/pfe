import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DoctorsScreen = ({ route }) => {
  const { specialty } = route.params;
  const { userToken } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/doctors/${specialty}`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        if (response.status === 200) {
          setDoctors(response.data);
        } else {
          setError('Failed to load doctors due to server error');
        }
      } catch (error) {
        setError(error.response ? error.response.data.message : 'Failed to connect to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialty]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loading}>Loading doctors...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => console.log('Doctor selected', item.fullname)}>
              <Image
                source={require('../assets/images/docc.png') }
                style={styles.image}
              />
              <View style={styles.infoContainer}>
                <View style={styles.attributeContainer}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{item.fullname}</Text>
                </View>
                <View style={styles.attributeContainer}>
                  <Text style={styles.label}>Specialty:</Text>
                  <Text style={styles.value}>{item.specialty}</Text>
                </View>
                <View style={styles.attributeContainer}>
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value}>{item.address}</Text>
                </View>
                <View style={styles.attributeContainer}>
                  <Text style={styles.label}>Phone:</Text>
                  <Text style={styles.value}>{item.phoneNumber}</Text>
                </View>
                <View style={styles.attributeContainer}>
                  <Text style={styles.label}>Office Hours:</Text>
                  <Text style={styles.value}>{item.officeHours}</Text>
                </View>
                <View style={styles.attributeContainer}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{item.email}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noData}>No doctors found for this specialty.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  attributeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    flex: 1,
  },
  loading: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#000',
  },
});


export default DoctorsScreen;
