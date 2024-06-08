import React, { useContext, useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors'; // Assurez-vous d'importer les couleurs si vous utilisez un fichier de couleurs
import Toast from 'react-native-toast-message';

const ForgotScreen = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const navigation = useNavigation();

  const navigateToCodeScreen = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Empty field',
        text2: 'Please enter your email address.',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 },
      });
      return;
    }
    try {
      const resp = await forgotPassword(email, navigation);
      console.log(resp.data);
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Send code to</Text>
        <InputField
          label={'E-mail'}
          value={email}
          icon={<MaterialIcons name="alternate-email" size={20} color="#666" style={{ marginRight: 5,marginTop:5 }} />}
          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
        />
        <CustomButton label={"Send"} onPress={navigateToCodeScreen} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background, // Ajoutez une couleur de fond si nécessaire
  },
  container: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: '#fff', // Fond blanc pour le conteneur principal
    borderRadius: 10, // Coins arrondis pour le conteneur principal
    marginHorizontal: 20, // Marge horizontale pour espacer le conteneur des bords
    shadowColor: '#000', // Ombre pour ajouter de la profondeur
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Élève le conteneur pour une meilleure visibilité sur Android
  },
  headerText: {
    color: colors.blue_fonce, // Couleur de texte cohérente avec le thème
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'left', // Centrer le texte d'en-tête
  },
  inputField: {
    marginBottom: 20, // Espacement entre le champ de saisie et le bouton
  },
});

export default ForgotScreen;
