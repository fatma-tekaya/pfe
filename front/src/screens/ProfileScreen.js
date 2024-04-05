import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useState, useContext} from 'react';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {AuthContext} from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';

const ProfileScreen = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dobLabel, setDobLabel] = useState('Date of Birth');
  const {userInfo} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [email, setEmail] = useState(null);
  const [gender, setGender] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [location, setLocation] = useState(null);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
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
    }).then(image => {
      console.log(image);
      setImage(image.path);
    });
  };

  const handleUpload = () => {
    // Implémentez votre logique d'upload ici
    console.log('Image upload logic goes here');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, paddingHorizontal: 25}}>
          <View style={{alignItems: 'center', marginTop: 20}}>
            {userInfo.user.avatar ? (
              <Image
                source={{uri: userInfo.user.avatar}}
                style={{height: 100, width: 100, borderRadius: 50}}
              />
            ) : (
              <MaterialIcons name="photo-camera" size={100} color="#AD40AF" />
            )}
            <TouchableOpacity
              style={{
                backgroundColor: '#AD40AF',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                marginTop: 10,
                marginTop: 10,
              }}
              onPress={takePhotoFromCamera}>
              <Text style={{color: '#fff', fontWeight: '700'}}>
                Prendre une photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#AD40AF',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                marginTop: 10,
              }}
              onPress={choosePhotoFromLibrary}>
              <Text style={{color: '#fff',
    fontWeight: '700'}}>Choisir une photo</Text>
            </TouchableOpacity>
          </View>
          <InputField
            label={'Full Name'}
            value={fullname}
            onChangeText={text => setFullname(text)}
            icon={<Ionicons name="person-outline" size={20} color="#666" />}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
              paddingBottom: 8,
              marginBottom: 25,
            }}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={{marginLeft: 5}}>
              <Text style={{color: '#666'}}>{dobLabel}</Text>
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
          <InputField
            label={'Email'}
            value={email}
            onChangeText={text => setEmail(text)}
            icon={
              <MaterialIcons name="alternate-email" size={20} color="#666" />
            }
            keyboardType="email-address"
          />
          <InputField
            label={'Location'}
            value={location}
            onChangeText={text => setLocation(text)}
            icon={<Entypo name="location" size={20} color="#666" />}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
              paddingBottom: 8,
              marginBottom: 25,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialCommunityIcons
              name="gender-male-female"
              size={25}
              color="#666"
            />
            <Text style={{ marginLeft: 5, fontSize: 16 ,color:'#666'}}>Gender</Text>
            </View>
            <View style={{flexDirection: 'row', marginLeft: 5}}>
              <TouchableOpacity
                style={{
                  backgroundColor: gender === 'male' ? '#AD40AF' : '#ccc',
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                  marginRight: 10,
                }}
                onPress={() => setGender('male')}>
                <Text style={{color: '#fff'}}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: gender === 'female' ? '#AD40AF' : '#ccc',
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                }}
                onPress={() => setGender('female')}>
                <Text style={{color: '#fff'}}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          <InputField
            label={'Height'}
            value={height}
            onChangeText={text => setHeight(text)}
            icon={
              <MaterialCommunityIcons
                name="human-male-height-variant"
                size={20}
                color="#666"
              />
            }
          />
          <InputField
            label={'Weight'}
            value={weight}
            onChangeText={text => setWeight(text)}
            icon={<FontAwesome6 name="weight-scale" size={20} color="#666" />}
          />

          <CustomButton label={'Update'} onPress={handleUpload} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
