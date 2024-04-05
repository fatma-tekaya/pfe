import { View, Text , TouchableOpacity} from 'react-native'
import React , {useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FavoriteScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#fff"
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
    <Text style={{color:'black'}}>Favv Screen</Text>
  </View>
  )
}

export default FavoriteScreen