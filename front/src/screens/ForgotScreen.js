import React, { useContext, useState } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import InputField from '../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ForgotScreen = () => {
 
  const { forgotPassword  } = useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const navigation = useNavigation();

  const navigateToCodeScreen = async () => {
    try {
      const resp = await forgotPassword(email, navigation);
      
        console.log(resp.data)
       
      
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ paddingHorizontal: 25 }}>
        <Text style={{ color: 'black', fontSize: 20, marginBottom: 10 }}>Envoyer le code à :</Text>
        <InputField
          label={'E-mail'}
          value={email}
          icon={<MaterialIcons name="alternate-email" size={20} color="#666" style={{ marginRight: 5 }} />}
          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
        />
        <CustomButton label={"Envoyer"} onPress={navigateToCodeScreen} />
      </View>
    </SafeAreaView>
  );
};

export default ForgotScreen;
