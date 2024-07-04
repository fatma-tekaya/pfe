import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL, FLASK_API_URL } from '../config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Toast from 'react-native-toast-message';
import Entypo from 'react-native-vector-icons/Entypo';

const FavoriteScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { userToken, setIsLoading } = useContext(AuthContext);
  const [base64Image, setBase64Image] = useState(null);

  const pickImageFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      setSelectedImage(image.path);
      setBase64Image(image.data);
    });
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      setSelectedImage(image.path);
      setBase64Image(image.data);
    });
  };

  const anomalyInfo = {
    Acne: {
      description: 'Acne is a skin condition that occurs when your hair follicles become plugged with oil and dead skin cells, leading to whiteheads, blackheads, or pimples.',
      advice: 'Keep your face clean, avoid popping pimples, and use non-comedogenic makeup.',
      moreInfoUrl: 'https://www.google.nl/',
    },
    Eczema: {
      description: "Eczema, or atopic dermatitis, is a condition that makes your skin red and itchy. It's common in children but can occur at any age.",
      advice: 'Moisturize regularly, avoid harsh soaps and detergents, and consider using a humidifier in dry weather.',
      moreInfoUrl: 'https://www.google.nl/',
    },
    Rosacea: {
      description: 'Rosacea is a common skin condition that causes redness and visible blood vessels in your face. It may also produce small, red, pus-filled bumps.',
      advice: 'Avoid triggers like hot drinks, spicy foods, and alcohol. Use gentle skin care products and consider medical therapies if symptoms persist.',
      moreInfoUrl: 'https://www.google.nl/',
    },
    'Actinic Keratosis': {
      description: 'Actinic Keratosis is a rough, scaly patch on your skin that develops from years of exposure to the sun, and can sometimes progress to skin cancer.',
      advice: 'Seek shade, wear sun-protective clothing, and apply sunscreen regularly.',
      moreInfoUrl: 'https://www.google.nl/',
    },
    'Basal Cell Carcinoma': {
      description: 'Basal Cell Carcinoma is a type of skin cancer that begins in the basal cells. It often manifests as a slightly transparent bump on the sun-exposed skin.',
      advice: 'Consult a dermatologist for potential treatment options such as surgical removal or topical treatments.',
      moreInfoUrl: 'https://www.google.nl/',
    },
  };

  const uploadImage = async () => {
    if (!selectedImage || !base64Image) {
      Toast.show({
        type: 'error',
        text1: 'Be careful',
        text2: 'Please select an image first!',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
      return;
    }

    setIsLoading(true);
    try {
      const predictionResponse = await axios.post(
        `${FLASK_API_URL}/predict`,
        { image: base64Image },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      if (predictionResponse.data && predictionResponse.data.predicted_class) {
        const className = predictionResponse.data.predicted_class;
        const resultData = {
          imageUrl: selectedImage,  // Ensure imageUrl is correctly set here
          label: className,
          description: anomalyInfo[className].description,
          advice: anomalyInfo[className].advice,
          moreInfoUrl:anomalyInfo[className].moreInfoUrl,
        };

        navigation.navigate('Anomaly Info', { result: resultData });

        const formData = new FormData();
        formData.append('picture', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'upload.jpg',
        });
        formData.append('label', predictionResponse.data.predicted_class);

        const uploadResponse = await axios.put(
          `${BASE_URL}/upload-picture`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${userToken}`,
            },
          },
        );

        if (uploadResponse.data && uploadResponse.data.success) {
          console.log('Image and prediction saved successfully!');
        } else {
          alert('Failed to save the image and prediction.');
        }
      } else {
        alert('Failed to get a valid prediction from the server.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: 'Failed to upload image',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 14 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setBase64Image(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyText}>View Previous Results</Text>
        </TouchableOpacity>
      </View>
      {!selectedImage ? (
        <View style={globalStyles.emptyContainer}>
          <Image
            source={require('../assets/images/robot.gif')}
            style={globalStyles.emptyGif}
          />
          <Text style={globalStyles.emptyText}>Please provide your photo for disease detection.</Text>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.deleteButton} onPress={removeImage}>
          <Entypo name="cross" size={35} color="gray" />
          </TouchableOpacity>
        </View>
      )}
      {selectedImage && (
        <TouchableOpacity style={styles.analyzeButton} onPress={uploadImage}>
          <Text style={styles.buttonText}>Predict disease</Text>
        </TouchableOpacity>
      )}
      {!selectedImage && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.cameraButton} onPress={takePhotoFromCamera}>
            <MaterialIcons name="photo-camera" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{color:'black'}}>Or</Text>
          <TouchableOpacity onPress={pickImageFromLibrary}>
            <Text style={styles.choosePhotoText}>Choose Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyText: {
    color: colors.blue_ciel,
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: 500,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 50,
  },
  analyzeButton: {
    backgroundColor: '#0f3f61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:5,
  },
  cameraButton: {
    backgroundColor: '#008ef7',
    borderRadius: 50,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
 
  },
  choosePhotoText: {
    color: colors.blue_ciel,
    fontFamily: 'Outfit-Medium',
    fontSize: 20,
    marginBottom:100
  },
});

export default FavoriteScreen;