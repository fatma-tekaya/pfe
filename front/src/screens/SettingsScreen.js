import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from '../styles/colors';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dobLabel, setDobLabel] = useState('Date of Birth');
  const { userInfo, updateUserProfile } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [location, setLocation] = useState('');

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
      setImage(userInfo.user.avatar || userInfo.user.photo || null);
    }
  }, [userInfo]);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
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
      setImage(image.path);
    });
  };

  const getUpdatedData = () => {
    const updatedData = {
      fullname,
      email,
      location,
      gender,
      height,
      weight,
      birthdate: date.toISOString(),
      profile: image || ''
    };
    return updatedData;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.profileSection}>
            {image || userInfo.user.avatar ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: image || userInfo.user.avatar }}
                  style={styles.profileImage}
                />
              </View>
            ) : (
              <MaterialIcons name="photo-camera" size={100} color="#2F4F4F" />
            )}
            <TouchableOpacity
              style={styles.photoButton}
              onPress={takePhotoFromCamera}
            >
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={choosePhotoFromLibrary}
            >
              <Text style={styles.photoButtonText}>Choose Photo</Text>
            </TouchableOpacity>
          </View>

          <InputField
            label="Full Name"
            value={fullname}
            onChangeText={setFullname}
            icon={<Ionicons name="person-outline" size={20} color="#666" />}
          />
          <View style={styles.datePickerContainer}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Text style={styles.dateText}>{dobLabel}</Text>
            </TouchableOpacity>
          </View>
          <DatePicker
            modal
            open={open}
            date={date}
            mode="date"
            maximumDate={new Date('2005-01-01')}
            minimumDate={new Date('1980-01-01')}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
              setDobLabel(date.toDateString());
            }}
            onCancel={() => setOpen(false)}
          />
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            icon={<AntDesign name="mail" size={20} color="#666" />}
            keyboardType="email-address"
          />
          <InputField
            label="Location"
            value={location}
            onChangeText={setLocation}
            icon={<EvilIcons name="location" size={25} color="#666" />}
          />
          <View style={styles.genderContainer}>
            <View style={styles.genderLabel}>
              <FontAwesome name="transgender" size={25} color="#666" />
              <Text style={styles.genderText}>Gender</Text>
            </View>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Male' && styles.selectedGenderButton]}
                onPress={() => setGender('Male')}
              >
                <Text style={styles.genderButtonText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Female' && styles.selectedGenderButton]}
                onPress={() => setGender('Female')}
              >
                <Text style={styles.genderButtonText}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
          <InputField
            label="Height (cm)"
            keyboardType="numeric"
            value={height !== null ? height.toString() : ''}
            onChangeText={setHeight}
            icon={<MaterialCommunityIcons name="human-male-height-variant" size={20} color="#666" />}
          />
          <InputField
            label="Weight (kg)"
            keyboardType="numeric"
            value={weight !== null ? weight.toString() : ''}
            onChangeText={setWeight}
            icon={<FontAwesome6 name="weight-scale" size={20} color="#666" />}
          />
           <TouchableOpacity
              style={styles.updatebutton}
              onPress={() => updateUserProfile(getUpdatedData())}
            >
              <Text style={styles.photoButtonText}>Update</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  photoButton: {
    backgroundColor: colors.bleu_bleu,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  photoButtonText: {
    color: '#fff',
    fontFamily: 'Outfit-Regular',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 25,
  },
  dateText: {
    color: '#666',
    marginLeft: 5,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 25,
  },
  genderLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  genderText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#666',
  },
  genderButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  genderButton: {
    backgroundColor: '#dde4e8',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginRight: 10,
  },
  selectedGenderButton: {
    backgroundColor: '#67859b',
  },
  genderButtonText: {
    color: '#fff',
  },
  updatebutton:{
    backgroundColor: colors.bleu_bleu,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems:'center',
    marginBottom:30
  }
});

export default ProfileScreen;
