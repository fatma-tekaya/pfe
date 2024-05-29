import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
  { name: 'Néphrologue', icon: 'kidney' },
];
const MomentsScreen = () => {

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-left" size={24} color="#000" />
        <Text style={styles.headerText}>Spécialités</Text>
      </View>
      <View style={styles.searchSection}>
        <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Trouver un médecin..."
        />
      </View>

      <View style={styles.specialtiesContainer}>
        {specialties.map((specialty, index) => (
          <TouchableOpacity key={index} style={styles.specialtyButton}>
            <Icon name={specialty.icon} size={30} color="#000" />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specialtyButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  specialtyLabel: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
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

export default MomentsScreen