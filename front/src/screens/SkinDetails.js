import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';

const SkinDetails = ({ route }) => {
  const { result } = route.params;

  const handlePress = () => {
    Linking.openURL(result.moreInfoUrl);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Prediction Result</Text>
      <Image source={{ uri: result.image }} style={styles.image} />
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{result.predictedClass}</Text>
      </View>
      <Text style={styles.description}>{result.description}</Text>
      <Text style={styles.adviceTitle}>Advice:</Text>
      <Text style={styles.advice}>{result.advice}</Text>
      <TouchableOpacity onPress={handlePress} style={styles.moreInfoButton}>
        <Text style={styles.moreInfoButtonText}>Learn More</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: 'grey',
    marginBottom:10,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    width: '100%',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#495057',
  },
  description: {
    fontSize: 18,
    color: '#6c757d',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 20,
  },
  advice: {
    fontSize: 18,
    color: '#28a745',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  moreInfoButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  moreInfoButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SkinDetails;
