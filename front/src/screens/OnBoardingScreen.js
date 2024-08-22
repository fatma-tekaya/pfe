import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/colors';

const OnBoardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/logovff-sarr.png')} // Ensure the correct path
          style={styles.image}
          resizeMode="contain" // Adjust this to "cover", "contain", "stretch", "repeat", "center" as per requirement
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>
          Welcome to your Home Health Assistant App
        </Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Let's Start</Text>
          <MaterialIcons name="arrow-forward" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20, // Adjust the space between the image and the text
  },
  image: {
    width: '90%', // Adjust width as needed
    height: 300, // Adjust height as needed
  },
  textContainer: {
    backgroundColor: colors.background, // Semi-transparent overlay for text
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '90%',
  },
  welcomeText: {
    fontSize: 22,
    color: '#20315f',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: colors.bleu_bleu,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginRight: 10,
  }
});

export default OnBoardingScreen;
