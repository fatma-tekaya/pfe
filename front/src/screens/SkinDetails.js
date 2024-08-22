import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { colors } from '../styles/colors';

const SkinDetails = ({ route }) => {
  const { result } = route.params;

  const openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Unable to open this URL", url);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Skin Analysis Result</Text>
      <View style={styles.imageContainer}>
        <Image source={{ uri: result.imageUrl }} style={styles.image} />
      </View>
      <Text style={styles.label}>Diagnosis:</Text>
      <Text style={styles.resultText}>{result.label}</Text>
      <Text style={styles.description}>{result.description}</Text>
      <Text style={styles.label}>Advice:</Text>
      <Text style={styles.advice}>{result.advice}</Text>
      <TouchableOpacity style={styles.linkButton} onPress={() => openURL(result.moreInfoUrl)}>
        <Text style={styles.urlText}>Learn More</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background, 
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 10,
    overflow: 'hidden',
    marginBottom:15
    //borderColor: colors.lightGray,
    //borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    color: '#6c757d',
    fontFamily: 'Outfit-SemiBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: colors.bleu_bleu,
    fontFamily: 'Outfit-SemiBold',
    alignSelf: 'flex-start',
    width: '100%',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 20,
    color: '#6c757d',
    
    fontFamily: 'Outfit-Medium',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    fontFamily: 'Outfit-Regular',
    marginBottom: 15,
  },
  advice: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#6c757d',
    marginBottom: 20,
  },
  urlText: {
    color: '#008ef7',
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  linkButton: {
    padding: 10,
    alignItems: 'center',
   
  },
});

export default SkinDetails;
