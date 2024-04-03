import { View, Text,TouchableOpacity,Image ,Button} from 'react-native'
import React,{useState , useContext} from 'react'
import DatePicker from  'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import {AuthContext} from '../context/AuthContext';

const ProfileScreen = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dobLabel, setDobLabel] = useState('Date of Birth')
  const {userInfo}=useContext(AuthContext);
  const [image, setImage] = useState(null);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((image) => {
      console.log(image);
      setImage(image.path);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((image) => {
      console.log(image);
      setImage(image.path);
    });
  };

  const handleUpload = () => {
    // Implémentez votre logique d'upload ici
    console.log('Image upload logic goes here');
  };

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
    <Text style={{color:'black'}}>Profile Screen</Text>

<Image
            source={
              userInfo.user.avatar
                ? {uri: userInfo.user.avatar}
                : require('../assets/images/user-profile.jpg')
            }
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
<TouchableOpacity
        style={{ backgroundColor: '#2e64e5', padding: 10, borderRadius: 10, marginBottom: 10 }}
        onPress={takePhotoFromCamera}
      >
        <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Prendre une photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: '#2e64e5', padding: 10, borderRadius: 10, marginBottom: 10 }}
        onPress={choosePhotoFromLibrary}
      >
        <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Choisir une photo</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 10, marginTop: 20 }} />
      )}
     
      <View
  style={{
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 30,
  }}>
  <Ionicons
    name="calendar-outline"
    size={20}
    color="#666"
    style={{marginRight: 5}}
  />
  <TouchableOpacity onPress={() => setOpen(true)}>
    <Text style={{color: '#666', marginLeft: 5, marginTop: 5}}>
      {dobLabel}
    </Text>
  </TouchableOpacity>
</View>

<DatePicker
  modal
  open={open}
  date={date}
  mode={'date'}
  maximumDate={new Date('2005-01-01')}
  minimumDate={new Date('1980-01-01')}
  onConfirm={date => {
    setOpen(false);
    setDate(date);
    setDobLabel(date.toDateString());
  }}
  onCancel={() => {
    setOpen(false);
  }}
/> 
<Button title="Update" onPress={handleUpload} />
  </View>
  )
}

export default ProfileScreen