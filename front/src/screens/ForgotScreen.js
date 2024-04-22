import React, { useContext, useState } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import InputField from '../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ForgotScreen = ({navigation}) => {
 // const navigate = useNavigation();
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState(null);

  const navigateToCodeScreen = async () => {
    try {
      // Appel de la fonction forgotPassword pour envoyer le code de réinitialisation
      const response = await forgotPassword(email);
      
      // Si la réinitialisation du mot de passe est réussie et redirectTo est défini sur 'Code'
      if (response.success && response.redirectTo === 'Code') {
        console.log('navigationn', {email})
        navigation.navigate('Code',{email});
      } else {
        // Gérer d'autres cas si nécessaire
        console.log("La redirection vers 'CodeScreen' n'est pas définie.");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation du mot de passe :', error);
      // Gérer l'erreur (par exemple, afficher un message d'erreur à l'utilisateur)
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
