import { View, SafeAreaView, TouchableOpacity ,Text} from 'react-native'
import React, { useState, useContext } from 'react'
import InputField from '../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { globalStyles } from '../styles/globalStyles';


const CodeScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [code, setCode] = useState(null)
  const [conpass, setConpass] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const { resetPasssword } = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  const handelCode = async () => {

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
        text1: 'Error',
        text2: 'Passwords do not match',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    try {
      // Appel de la fonction forgotPassword pour envoyer le code de réinitialisation
      const response = await resetPasssword(code, newPassword);

      // Si la réinitialisation du mot de passe est réussie et redirectTo est défini sur 'Code'
      if (response.success) {
        //console.log('navigationn', {email})
        navigation.navigate('Reset', { email });
      } else {
        Toast.show({
          type: 'Error',
          text1: 'Error',
          text2: 'Error sending reset password to email',
          text1Style: { fontSize: 14 },
          text2Style: { fontSize: 14 },
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
      return;

    }
  };


  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ paddingHorizontal: 25 }}>
        <InputField
          label={'Code'}
          value={code}
          onChangeText={text => setCode(text)}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <InputField
            label={'New Password'}
            value={newPassword}
            icon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            inputType={passwordVisible ? 'text' : 'password'}
            onChangeText={text => setNewPassword(text)}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{ position: 'absolute', right: 10, top: 10 }}>
            <Ionicons
              name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={globalStyles.errorText}>{passwordError}</Text> : null}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <InputField
            label={'Confirm New Password'}
            value={conpass}
            icon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            inputType={passwordVisible1 ? 'text' : 'password'}

            onChangeText={text => setConpass(text)}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility1}
            style={{ position: 'absolute', right: 10, top: 10 }}>
            <Ionicons
              name={passwordVisible1 ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <CustomButton label={"Send"} onPress={handelCode} />

      </View>
    </SafeAreaView>
  )
}

export default CodeScreen