import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Assurez-vous que le chemin est correct
import { BASE_URL, FLASK_API_URL } from '../config'; // Assurez-vous que le chemin est correct
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FavoriteScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { userToken, setIsLoading } = useContext(AuthContext);
  const [base64Image, setBase64Image] = useState(null);
  const [expandedType, setExpandedType] = useState(null);

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
      alert('Please select an image first!');
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
          image: selectedImage,
          predictedClass: className,
          description: anomalyInfo[className].description,
          advice: anomalyInfo[className].advice,
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
      alert('Upload failed!');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (key) => {
    setExpandedType(expandedType === key ? null : key);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setBase64Image(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Types :</Text>
        <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyButtonText}>View Previous Results</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>
        {Object.entries(anomalyInfo).map(([key, value]) => (
          <TouchableOpacity key={key} style={styles.infoCard} onPress={() => toggleExpand(key)}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>{key}</Text>
              <FontAwesome name={expandedType === key ? 'chevron-up' : 'chevron-down'} size={24} color="#0f3f61" />
            </View>
            {expandedType === key && (
              <View style={styles.infoContent}>
                <Text style={styles.infoText}>{value.description}</Text>
                <Text style={styles.infoText}><Text style={styles.infoTextBold}>Advice:</Text> {value.advice}</Text>
                <TouchableOpacity onPress={() => Alert.alert('More Info', value.moreInfoUrl)}>
                  <Text style={styles.moreInfoLink}>More Info</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.deleteButton} onPress={removeImage}>
            <MaterialIcons name="cancel" size={35} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.analyzeButton} onPress={uploadImage}>
            <Text style={styles.buttonText}>Predict Anomaly</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImageFromLibrary}>
          <Text style={styles.buttonText}>Choose Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhotoFromCamera}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  historyButton: {
    backgroundColor: '#0f3f61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContainer: {
    marginBottom: 20,
  },
 
  infoCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f3f61',
  },
  infoContent: {
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  infoTextBold: {
    fontWeight: 'bold',
  },
  moreInfoLink: {
    fontSize: 16,
    color: '#0f3f61',
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: 300,
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
    position: 'absolute',
    bottom: 10,
    left: '43%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#0f3f61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#0f3f61',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FavoriteScreen;
