import { View, SafeAreaView,Text } from 'react-native'
import React, { useContext, useState } from 'react'
import InputField from '../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';


const ForgotScreen = ({navigation}) => {

    const [email, setEmail] = useState(null);
    const { forgotPassword } = useContext(AuthContext);
  
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ paddingHorizontal: 25 }}>
          <Text style={{ color: 'black', fontSize: 20, marginBottom: 10 }}>Send code to:</Text>
          <InputField
            label={'Email'}
            value={email}
            icon={
              <MaterialIcons
                name="alternate-email"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            }
            keyboardType="email-address"
            onChangeText={text => setEmail(text)}
          />
          <CustomButton label={"Send"} onPress={() => forgotPassword(email,navigation)} />
        </View>
      </SafeAreaView>
    );
  };

export default ForgotScreen