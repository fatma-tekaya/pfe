import { View, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import InputField from '../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';

const CodeScreen = ({navigation}) => {
    const[code,setCode]=useState(null)
    const [conpass, setConpass] = useState(null);
    const [npass, setNpass] = useState(null);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <View style={{paddingHorizontal: 25}}>
       <InputField
          label={'Code'}
          value={code}
        //   icon={
        //     <MaterialIcons
        //     name="alternate-email"
        //     size={20}
        //     color="#666"
        //     style={{marginRight: 5}}
        //   />
        //   }
        //   keyboardType="email-address"
          onChangeText={text=>setCode(text)}
        />
            <InputField
          label={'New Password'}
          value={npass}
        //   icon={
        //     <MaterialIcons
        //     name="alternate-email"
        //     size={20}
        //     color="#666"
        //     style={{marginRight: 5}}
        //   />
        //   }
        //   keyboardType="email-address"
          onChangeText={text=>setNpass(text)}
        />
           <InputField
          label={'Confirm New Password'}
          value={conpass}
        //   icon={
        //     <MaterialIcons
        //     name="alternate-email"
        //     size={20}
        //     color="#666"
        //     style={{marginRight: 5}}
        //   />
        //   }
        //   keyboardType="email-address"
          onChangeText={text=>setConpass(text)}
        />
       
        <CustomButton label={"Send"} onPress={() => {navigation.navigate('Reset')}} />

    </View>
    </SafeAreaView>
  )
}

export default CodeScreen