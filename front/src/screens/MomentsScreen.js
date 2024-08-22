import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../styles/colors';


const specialties = [
  { name: 'Dentist', icon: 'tooth' },
  { name: 'Gynecologist', icon: 'person-pregnant' },
  { name: 'Laboratory', icon: 'flask' },
  { name: 'Veterinarian', icon: 'paw' },
  { name: 'General Practitioner', icon: 'stethoscope' },
  { name: 'Sexologist', icon: 'venus-mars' },


  { name: 'Orthopedist', icon: 'bone' },
  { name: 'ENT', icon: 'ear-listen' },
  { name: 'Psychiatrist', icon: 'brain' },
  { name: 'Cardiologist', icon: 'heart-pulse' },
  
  { name: 'Pediatrician', icon: 'person-breastfeeding' },

  { name: 'Neurologist', icon: 'brain' },
  { name: 'Nephrologist', icon: 'stethoscope' },
  { name: 'Nutritionist', icon: 'apple-whole' },
  { name: 'Child Psychiatrist', icon: 'head-side-virus' },
  { name: 'Diabetologist', icon: 'droplet' },
 
  { name: 'Dermatologist', icon: 'hand-dots' },
  { name: 'Ophthalmologist', icon: 'eye' },
  { name: 'Gastroenterologist', icon: 'virus' },
  { name: 'Rheumatologist', icon: 'wheelchair' },
  { name: 'Pulmonologist', icon: 'lungs' },
];

const MomentsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>      
      <View style={styles.specialtiesContainer}>
        {specialties.map((specialty, index) => (
          <TouchableOpacity
            key={index}
            style={styles.specialtyButton}
            onPress={() => navigation.navigate('Doctors List', { specialty: specialty.name })}
          >
            <View style={styles.iconContainer}>
              <Icon name={specialty.icon} size={30} color="#4A90E2" />
            </View>
            <Text style={styles.specialtyLabel}>{specialty.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  specialtyButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#E1F5FE',
    borderRadius: 50,
    padding: 10,
    marginBottom: 10,
  },
  specialtyLabel: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
});

export default MomentsScreen;
