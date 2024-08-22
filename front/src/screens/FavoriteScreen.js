import React, { useState, useContext ,useEffect} from 'react';

import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL, FLASK_API_URL } from '../config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Toast from 'react-native-toast-message';
import Entypo from 'react-native-vector-icons/Entypo';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Animated, Easing } from 'react-native';

const FavoriteScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { userToken, setIsLoading } = useContext(AuthContext);
  const [base64Image, setBase64Image] = useState(null);
  const [translateAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0)); // Initial rotation is 0

  const startFloatingAndRotateAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateAnim, {
            toValue: 10,  // Move slightly down
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,  // Rotate slightly (e.g., to 5 degrees)
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true
          })
        ]),
        Animated.parallel([
          Animated.timing(translateAnim, {
            toValue: -10,  // Move slightly up
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,  // Rotate back slightly (e.g., to -5 degrees)
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true
          })
        ])
      ])
    ).start();
  };
  
  useEffect(() => {
    startFloatingAndRotateAnimation();
  }, []);
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
        <TouchableOpacity onPress={() => navigation.navigate('History')}style={styles.addButton}>
        <MaterialIcons name="history" size={17} color="#fff" />
          <Text style={styles.addButtonText}>Check Your History</Text>
        </TouchableOpacity>
      </View>
      {!selectedImage ? (
        <View >
       <Animated.View
  style={{
    transform: [
      { translateY: translateAnim },
      { rotate: rotateAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-5deg', '5deg']  // Adjust the degree of rotation as needed
      }) }
    ],
    width: 280,
    height: 280,

marginLeft:150,
marginTop:100,
    marginTop: 50,
    alignSelf: 'center'
  }}
>
        <Image
          source={require('../assets/images/dermatology.png')}
          style={{
            width: '60%',
            height: '60%',
          }}
        />
      </Animated.View>
          <Text style={{fontFamily: 'Outfit-Light',
        fontSize: 20,
        color: colors.bleu,
        textAlign: 'center',
        marginTop: -50}}>Ready to check your skin? Upload a photo now!</Text>
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
   <TouchableOpacity style={styles.addButtonLink} onPress={takePhotoFromCamera}>
     <MaterialIcons name="photo-camera" size={28}  color= '#008ef7'  />
     <Text style={styles.addButtonTextLink  }>Take Photo</Text>
   </TouchableOpacity>
   <Text style={styles.orText}>Or</Text>
   <TouchableOpacity style={styles.addButtonLink} onPress={pickImageFromLibrary}>
     <MaterialIcons name="photo-library" size={28}  color='#008ef7'  />
     <Text style={styles.addButtonTextLink}>Choose Photo</Text>
   </TouchableOpacity>
 </View>
 
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  addButtonLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,  // Reduced padding
    paddingHorizontal: 5,
    marginTop: '5%',
    marginBottom: '5%',
  },

  addButtonTextLink: {
    color: '#008ef7',  // Bright color to give a link-like appearance
    marginLeft: 6,
    fontSize: 16,
    fontFamily: 'Outfit-Light',
    textDecorationLine: 'underline',  // Underline to emphasize the link appearance
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008ef7',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
    marginTop: '5%',
    marginBottom: '5%',
},

addButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 16,
    fontFamily: 'Outfit-Light',
},
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#008ef7',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:5,
  
  },

  cameraButton: {
    backgroundColor: '#008ef7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
  },
  galleryButton: {
    backgroundColor: '#008ef7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
  },
  orText: {
    color: colors.bleu,
    fontSize: 16,
    paddingHorizontal: 10,
  }

});

export default FavoriteScreen;