import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import InputField from '../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Toast from 'react-native-toast-message';

const ForgotScreen = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Empty field',
        text2: 'Please enter your email address.',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
      return;
    }
    try {
      const response = await forgotPassword(email,navigation);
      console.log(response);
      //navigation.navigate('ResetPasswordScreen'); // Adjust as per your navigation setup
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles. title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Please enter a valid email
        </Text>
        <InputField
          label="Email"
          value={email}
          icon={
            <MaterialIcons
              name="email"
              size={20}
              color="#666"
              style={{ marginRight: 5 , marginTop:6 }}
            />
          }
          keyboardType="email-address"
          onChangeText={setEmail}
          containerStyle={globalStyles.inputField}
        />
        <CustomButton
          label="Send Reset Code"
          onPress={handleForgotPassword}
          buttonStyle={globalStyles.button}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backToLogin}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background, // Light grey background
  },title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#20315f',
    fontFamily: 'Outfit-Medium',
  },
  headerText: {
    fontSize: 20,
    marginBottom: 10,
    color: '#20315f',
    fontFamily: 'Outfit-Medium',
    
  },subtitle: {
    marginBottom: 10,
    color: '#666',
    fontFamily: 'Outfit-Regular',
  },
  container: {
    //paddingHorizontal: 25,
    
    //borderRadius: 10, // Rounded corners for the main container
    marginHorizontal: 20, // Horizontal margin to space the container from the edges
    paddingVertical: 20,
    
  
  },
  backToLogin: {
    marginTop: 10,
    alignSelf: 'center',
  },
  backToLoginText: {
    color: colors.blue_fonce,
    fontFamily: 'Outfit-Medium',
  },
});

export default ForgotScreen;
