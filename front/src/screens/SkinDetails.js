import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';

const SkinDetails = ({ route }) => {
  const { result } = route.params;

  const handlePress = () => {
    Linking.openURL(result.moreInfoUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prediction Result</Text>
      <Image source={{ uri: result.image }} style={styles.image} />
      <Text style={styles.resultText}>{result.predictedClass}</Text>
      <Text style={styles.description}>{result.description}</Text>
      <Text style={styles.advice}>{result.advice}</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.moreInfo}>Learn more</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'grey',
  },
  resultText: {
    fontSize: 20,
    color: '#333',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  advice: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
  moreInfo: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },
});

export default SkinDetails;
