// DoctorsScreen.js
import React from 'react';
import { View, Text,TextInput, Image, StyleSheet, FlatList } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { colors } from '../styles/colors';

const doctors = [
  {
    id: '1',
    name: 'Dr. Eya',
    image: 'https://static.vecteezy.com/system/resources/previews/005/241/180/non_2x/doctor-avatar-character-standing-in-the-circle-flat-style-design-illustration-isolated-on-white-background-medical-clinic-hospital-staff-employee-icon-vector.jpg',
    address: 'Ksibet el Madiouni',
    phone: '99 999 999',
    email: 'eya@yahoo.com',
    hours: 'Mon-Fri: 9am-5pm',
    description: 'Experienced with 10 years of experience.',
    spec:'cardiologue'

  },
  {
    id: '2',
    name: 'Dr. Fatma',
    image: 'https://static.vecteezy.com/system/resources/previews/005/241/180/non_2x/doctor-avatar-character-standing-in-the-circle-flat-style-design-illustration-isolated-on-white-background-medical-clinic-hospital-staff-employee-icon-vector.jpg',
    address: 'Teboulba',
    phone: '55 555 555',
    email: 'fatma@hotmail.com',
    hours: 'Mon-Fri: 9am-5pm',
    description: 'Experienced with 10 years of experience.',
    spec:'ophtalmologue'    
  },
  {
    id: '3',
    name: 'Dr. Yosra',
    image: 'https://static.vecteezy.com/system/resources/previews/005/241/180/non_2x/doctor-avatar-character-standing-in-the-circle-flat-style-design-illustration-isolated-on-white-background-medical-clinic-hospital-staff-employee-icon-vector.jpg',
    address: 'Monastir',
    phone: '77 777 777',
    email: 'yosra@gmail.com',
    hours: 'Mon-Fri: 9am-5pm',
    description: 'Experienced with 10 years of experience.',
    spec:'pédiatre'    
  },
  {
    id: '4',
    name: 'Dr. Mohamed',
    image: 'https://t4.ftcdn.net/jpg/01/34/29/31/360_F_134293169_ymHT6Lufl0i94WzyE0NNMyDkiMCH9HWx.jpg',
    address: 'Sousse',
    phone: '44 444 444',
    email: 'mohamed@hotmail.com',
    hours: 'Mon-Fri: 9am-5pm',
    description: 'Experienced with 10 years of experience.',
    spec:'dermatologue'    
  },
  {
    id: '5',
    name: 'Dr. Salah',
    image: 'https://t4.ftcdn.net/jpg/01/34/29/31/360_F_134293169_ymHT6Lufl0i94WzyE0NNMyDkiMCH9HWx.jpg',
    address: 'Bizerte',
    phone: '88 888 888',
    email: 'salah@gmail.com',
    hours: 'Mon-Fri: 9am-5pm',
    description: 'Experienced with 10 years of experience.',
    spec:'dentiste'    
  },


];

const DoctorsScreen = ({ route }) => {
  const { specialty } = route.params;
  const filteredDoctors = doctors.filter(doctor => doctor.spec.toLowerCase() === specialty.toLowerCase());

  return (
    <View style={styles.container}>
    
      <Text style={styles.headerText}>{specialty}</Text>
      <View style={styles.searchSection}>
        <EvilIcons name="search" size={24} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Find a doctor..."
        />
      </View>
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>Address: {item.address}</Text>
              <Text style={styles.phone}>Number: {item.phone}</Text>
              <Text style={styles.hours}>{item.hours}</Text>
              <Text style={styles.description}>Bio: {item.description}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No doctors found for this specialty.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 1,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily:'Outfit-Regular',
    fontSize: 16,
  },
  headerText: {
    fontSize: 24,
    fontFamily:'Outfit-Regular',
    marginBottom: 20,
    textAlign: 'center',
    color:colors.bleu
  },
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily:'Outfit-Regular',
    fontSize: 18,
    fontWeight: 'bold',
  },
  address: {
    fontFamily:'Outfit-Regular',
    fontSize: 14,
    color: '#666',
  },
  phone: {
    fontFamily:'Outfit-Regular',
    fontSize: 14,
    color: '#666',
  },
  hours: {
    fontFamily:'Outfit-Regular',
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontFamily:'Outfit-Regular',
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily:'Outfit-Regular',
    fontSize: 18,
    color: '#666',
  },
});

export default DoctorsScreen;
