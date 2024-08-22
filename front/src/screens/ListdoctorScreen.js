import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import { colors } from '../styles/colors';
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import InputField from '../components/InputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const DoctorsScreen = ({ route }) => {
  const { specialty } = route.params;
  const { userToken } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/doctors/${specialty}`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        if (response.status === 200) {
          setDoctors(response.data);
          setFilteredDoctors(response.data);
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

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor =>
        doctor.fullname.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);
  

  return (
    <View style={styles.container}>
    
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <InputField
         // style={styles.searchBar}
         label={"Search by name..."}
       
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {loading ? (
        <Text style={styles.loading}>Loading doctors...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
           

  <TouchableOpacity style={styles.card} onPress={() => console.log('Doctor selected', item.fullname)}>
  <Image    source={require('../assets/images/docc.png')} style={styles.image} />
  <View style={styles.infoContainer}>
    <Text style={styles.doctorName}>{item.fullname}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MaterialCommunityIcons name="map-marker" size={16} color="#00aeef" style={{marginRight:13}} />
      <Text style={styles.infoText}>{item.address}</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MaterialCommunityIcons name="phone" size={16} color="#00aeef" style={{marginRight:13}}/>
      <Text style={styles.infoText}>{item.phoneNumber}</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MaterialCommunityIcons name="email" size={16} color="#00aeef" style={{marginRight:13}}/>
      <Text style={styles.infoText}>{item.email}</Text>
    </View>
  </View>
</TouchableOpacity>



           
          )}
          ListEmptyComponent={
            <Text style={styles.noData}>No doctors found {searchQuery ? `with the name "${searchQuery}"` : `for this specialty`}.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f7',  // Lighter grey for the background
    padding: 12,
    marginTop:15
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer:{},
  searchIcon:{
    marginLeft:360,
    marginBottom:-25
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 35,
  },
  infoContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  icon: {
    fontSize: 18,
    color: colors.bleu_bleu,
    marginRight: 6,
  },
  noData: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 20,
    fontSize: 16,
  },
});

export default DoctorsScreen;



