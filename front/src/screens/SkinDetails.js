import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { colors } from '../styles/colors';

const SkinDetails = ({ route }) => {
  const { result } = route.params;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Prediction Result</Text>
      <Image source={{ uri: result.imageUrl }} style={styles.image} />  
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{result.label}</Text>
      </View>
      <Text style={styles.description}>{result.description}</Text>
      <Text style={styles.adviceTitle}>Advice:</Text>
      <Text style={styles.advice}>{result.advice}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    color: colors.bleu,
    fontFamily: 'Outfit-Medium',
    fontSize: 28,
    marginBottom: 10,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: colors.blue_ciel,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    width: '100%',
  },
  resultText: {
    fontSize: 22,
    fontFamily: 'Outfit-Medium',
    color: '#495057',
  },
  description: {
    fontSize: 18,
    color: '#6c757d',
    fontFamily: 'Outfit-Medium',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  adviceTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
    color: '#28a745',
    marginTop: 20,
  },
  advice: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#6c757d',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default SkinDetails;
