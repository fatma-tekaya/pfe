import { View, SafeAreaView,TouchableOpacity } from 'react-native'
import React, { useState,useContext } from 'react'
import InputField from '../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';


const CodeScreen = ({navigation,route}) => {
  const { email } = route.params;
    const[code,setCode]=useState(null)
    const [conpass, setConpass] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const{resetPasssword}=useContext(AuthContext);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible1, setPasswordVisible1] = useState(false);

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
    const togglePasswordVisibility1 = () => {
      setPasswordVisible1(!passwordVisible1);
    };

    const handelCode = async () => {

      if ( !code || !conpass || !newPassword) {
        alert('Please fill in all fields');
        return;
      }
      if (conpass !== newPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        // Appel de la fonction forgotPassword pour envoyer le code de réinitialisation
        const response = await resetPasssword(code,newPassword);
        
        // Si la réinitialisation du mot de passe est réussie et redirectTo est défini sur 'Code'
        if (response.success) {
          //console.log('navigationn', {email})
          navigation.navigate('Reset',{email});
        } else {
          // Gérer d'autres cas si nécessaire
          alert("Error sending reset password email");
        }
      } catch (error) {
        alert('Erreur ', error);
        // Gérer l'erreur (par exemple, afficher un message d'erreur à l'utilisateur)
      }
    };
    

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <View style={{paddingHorizontal: 25}}>
       <InputField
          label={'Code'}
          value={code}
          onChangeText={text=>setCode(text)}
        />
         <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <InputField
          label={'New Password'}
          value={newPassword}
          icon={
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          inputType={passwordVisible ? 'text' : 'password'}
          onChangeText={text=>setNewPassword(text)}
        />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{position: 'absolute', right: 10, top: 10}}>
            <Ionicons
              name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
           <InputField
          label={'Confirm New Password'}
          value={conpass}
          icon={
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          inputType={passwordVisible1 ? 'text' : 'password'}
          
          onChangeText={text=>setConpass(text)}
        />
         <TouchableOpacity
            onPress={togglePasswordVisibility1}
            style={{position: 'absolute', right: 10, top: 10}}>
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