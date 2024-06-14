import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

const specialties = [
  { name: 'Dentiste', icon: 'tooth' },
  { name: 'Gynécologue', icon: 'person-pregnant' },
  { name: 'Laboratoire', icon: 'flask' },
  { name: 'Vétérinaire', icon: 'paw' },
  { name: 'Généraliste', icon: 'stethoscope' },
  { name: 'Sexologue', icon: 'venus-mars' },
  { name: 'Dermatologue', icon: 'hand-dots' },
  { name: 'Ophtalmologue', icon: 'eye' },
  { name: 'Orthopédiste', icon: 'bone' },
  { name: 'ORL', icon: 'ear-listen' },
  { name: 'Psychiatre', icon: 'brain' },
  { name: 'Cardiologue', icon: 'heart-pulse' },
  { name: 'Gastro', icon: 'virus' },
  { name: 'Pédiatre', icon: 'person-breastfeeding' },
  { name: 'Rhumatologue', icon: 'wheelchair' },
  { name: 'Neurologue', icon: 'brain' },
  { name: 'Pneumologue', icon: 'lungs' },
  { name: 'Nutritionniste', icon: 'apple-whole' },
  { name: 'Pédopsychiatre', icon: 'head-side-virus' },
  { name: 'Diabétologue', icon: 'droplet' },
  { name: 'Néphrologue', icon: 'stethoscope' },
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    marginVertical: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily:'Outfit-Regular',
    textAlign: 'center',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop:20
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
  allSpecialtiesButton: {
    alignItems: 'center',
    marginVertical: 20,
  },
  allSpecialtiesText: {
    fontSize: 16,
    color: '#007bff',
  },
});

export default MomentsScreen;
