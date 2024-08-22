import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../styles/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ResetScreen = ({ navigation, route }) => {
  const { email } = route.params;
  
  return (
    <View style={styles.container}>
      <MaterialIcons
              name="verified"
              size={80}
              color="#076a90"
              style={{ alignContent:'center',marginBottom:20 }}
            />
      <Text style={styles.successText}>
      Your Account has been registred successfully with {email}
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginButtonText}>Please Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background, // Add background color if needed
    paddingHorizontal: 20,
  },
  successText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#20315f',
    fontFamily: 'Outfit-Medium',
    
    textAlign: 'center', // Center align the text
  },
  loginButton: {
    backgroundColor: colors.bleu_bleu, // Use the color from your colors file
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3, // Add some shadow/elevation for better UI
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    textAlign: 'center', // Center align the button text
  },
});

export default ResetScreen;
