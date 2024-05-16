import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
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
  const {updateUserProfile} = useContext(AuthContext);
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

  useEffect(() => {
    if (userInfo.user) {
      setFullname(userInfo.user.fullname || userInfo.user.name || '');
      setEmail(userInfo.user.email || '');
      setGender(userInfo.user.gender || null);
      setHeight(userInfo.user.height || '');
      setWeight(userInfo.user.weight || '');
      setLocation(userInfo.user.location || '');
      if (userInfo.user.birthdate) {
        setDate(new Date(userInfo.user.birthdate));
        setDobLabel(new Date(userInfo.user.birthdate).toDateString());
      }
      // Assuming you have some logic to determine if there's an image or not
      // For instance, if there's an image URL in userInfo.user.avatar, you might set it like this:
      setImage(userInfo.user.avatar || userInfo.user.photo || null);
    }
  }, [userInfo]);
  const getUpdatedData = () => {
    const updatedData = {};

    if (fullname) {
      updatedData.fullname = fullname;
    }
    if (email) {
      updatedData.email = email;
    }
    if (location) {
      updatedData.location = location;
    }
    if (gender) {
      updatedData.gender = gender;
    }
    if (height) {
      updatedData.height = height;
    }
    if (weight) {
      updatedData.weight = weight;
    }
    if (date) updatedData.birthdate = date.toISOString(); // Assurez-vous de formater correctement la date
    if (image) {
      updatedData.profile = image;
    } else {
      updatedData.profile = ''; // Suppression de l'avatar si aucune image n'est fournie
    }

    return updatedData;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, paddingHorizontal: 25}}>
          <View
            style={{alignItems: 'center', marginTop: 20, marginVertical: 20}}>
            {image || userInfo.user.avatar ? (
              <View style={{position: 'relative'}}>
                {image && (
                  <View style={{position: 'relative'}}>
                    <Image
                      source={{uri: image}}
                      style={{height: 100, width: 100, borderRadius: 50}}
                    />
                    <TouchableOpacity
                      style={{position: 'absolute', top: 0, right: 0}}
                      onPress={() => setImage(null)}>
                      <MaterialIcons name="cancel" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                )}
                {userInfo.user.avatar && !image && (
                  <>
                    <Image
                      source={{uri: userInfo.user.avatar}}
                      style={{height: 100, width: 100, borderRadius: 50}}
                    />
                    <TouchableOpacity
                      style={{position: 'absolute', top: 0, right: 0}}
                      onPress={() => {
                        // Ajoutez ici la logique pour supprimer l'avatar du backend
                        // Assurez-vous également de mettre à jour l'état image après la suppression
                      }}>
                      <MaterialIcons name="cancel" size={24} color="black" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : (
              <MaterialIcons name="photo-camera" size={100} color="#2F4F4F" />
            )}

            <TouchableOpacity
              style={{
                backgroundColor: '#0f3f61',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                marginTop: 10,
              }}
              onPress={takePhotoFromCamera}>
              <Text style={{color: '#fff', fontWeight: '700'}}>
                Prendre une photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#0f3f61',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                marginTop: 10,
              }}
              onPress={choosePhotoFromLibrary}>
              <Text style={{color: '#fff', fontWeight: '700'}}>
                Choisir une photo
              </Text>
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
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <MaterialCommunityIcons
                name="gender-male-female"
                size={25}
                color="#666"
              />
              <Text style={{marginLeft: 5, fontSize: 16, color: '#666'}}>
                Gender
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginLeft: 8}}>
              <TouchableOpacity
                style={{
                  backgroundColor: gender === 'Male' ? '#0f3f61' : '#ccc',
                  paddingVertical: 8,
                  paddingHorizontal: 18,
                  borderRadius: 10,
                  marginRight: 10,
                }}
                onPress={() => setGender('Male')}>
                <Text style={{color: '#fff'}}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: gender === 'Female' ? '#0f3f61' : '#ccc',
                  paddingVertical: 8,
                  paddingHorizontal: 18,
                  borderRadius: 10,
                }}
                onPress={() => setGender('Female')}>
                <Text style={{color: '#fff'}}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          <InputField
            label={'Height (cm)'}
            keyboardType={'numeric'}
            value={height !== null ? height.toString() : ''}
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
            label={'Weight (kg)'}
            keyboardType={'numeric'}
            value={weight !== null ? weight.toString() : ''}
            onChangeText={text => setWeight(text)}
            icon={<FontAwesome6 name="weight-scale" size={20} color="#666" />}
          />

          <CustomButton
            label={'Update'}
            onPress={() => updateUserProfile(getUpdatedData())}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
