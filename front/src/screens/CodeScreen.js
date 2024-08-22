import React, { useContext, useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import { colors } from '../styles/colors';

const CodeScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [conpass, setConpass] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { resetPasssword } = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  const handleCode = async () => {
    if (!code || !conpass || !newPassword) {
      Toast.show({
        type: 'error',
        text1: 'Empty fields',
        text2: 'Please fill in all fields',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
      return;
    }
    if (conpass !== newPassword) {
      Toast.show({
        type: 'error',
        text1: 'Mismatch',
        text2: 'Passwords do not match',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
      return;
    }
    try {
      const response = await resetPasssword(code, newPassword);
      if (response.success) {
        navigation.navigate('Reset', { email });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Error resetting password',
          text1Style: { fontSize: 14 },
          text2Style: { fontSize: 14 }
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Check your verification code',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>
          Your verification code has been sent successfully to {email}
        </Text>
        <InputField
          label="Code"
          value={code}
          onChangeText={setCode}
          icon={<MaterialIcons name="vpn-key" size={20} color="#666" style={{marginTop:6}} />}
          containerStyle={styles.inputField}
        />
        <View style={styles.passwordContainer}>
          <InputField
            label="New Password"
            value={newPassword}
            icon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
            inputType={passwordVisible ? 'text' : 'password'}
            onChangeText={setNewPassword}
            containerStyle={styles.inputField}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconButton}>
            <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <InputField
            label="Confirm New Password"
            value={conpass}
            icon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
            inputType={passwordVisible1 ? 'text' : 'password'}
            onChangeText={setConpass}
            containerStyle={styles.inputField}
            secureTextEntry={!passwordVisible1}
          />
          <TouchableOpacity onPress={togglePasswordVisibility1} style={styles.iconButton}>
            <Ionicons name={passwordVisible1 ? 'eye' : 'eye-off'} size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <CustomButton label="Send" onPress={handleCode} buttonStyle={styles.button} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  container: {
   // paddingHorizontal: 25,
    paddingVertical: 20,
  

    marginHorizontal: 20,
  
   
  },   title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#20315f',
    fontFamily: 'Outfit-Medium',
  },subtitle: {
    marginBottom: 20,
    color: '#666',
    fontFamily: 'Outfit-Regular',
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#20315f',
    fontFamily: 'Outfit-Medium',
  
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  inputField: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    paddingRight: 40, // Give space for the eye icon
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0f3f61',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  }
});

export default CodeScreen;
