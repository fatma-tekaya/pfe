import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/colors';
const ConfirmationSentScreen = ({ navigation, route }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { email } = route.params;
  const { confirm } = useContext(AuthContext);

  const handleConfirm = async () => {
    if (!verificationCode) {
      Toast.show({
        type: 'error',
        text1: 'Empty field',
        text2:' Please enter the verification code',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
      return;
    }
    try {
      await confirm(verificationCode, email, navigation);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Check your verification code!',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>
          Your verification code has been sent successfully to {email}
        </Text>
        <Text style={styles.subtitle}>
          Please enter the received verification code
        </Text>
        <InputField
          label={'Verification Code'}
          value={verificationCode}
          icon={<MaterialIcons name="vpn-key" size={20} color="#666" style={{marginTop:6}} />}
          onChangeText={text => setVerificationCode(text)}
          style={styles.inputField}
        />
        <CustomButton label="Send" onPress={handleConfirm} style={styles.button} />
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
  innerContainer: {
    paddingHorizontal: 25,
    paddingVertical: 265,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#20315f',
    fontFamily: 'Outfit-Medium',
  },
  subtitle: {
    marginBottom: 20,
    color: '#666',
    fontFamily: 'Outfit-Regular',
  },
  inputField: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default ConfirmationSentScreen;
