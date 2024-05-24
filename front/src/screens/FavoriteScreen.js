import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Assurez-vous que le chemin est correct
import { BASE_URL, FLASK_API_URL } from '../config'; // Assurez-vous que le chemin est correct

const FavoriteScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { userToken, setIsLoading } = useContext(AuthContext);
  const [base64Image, setBase64Image] = useState(null);

  const pickImageFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true, // Include this line to get base64 image data
    }).then(image => {
      setSelectedImage(image.path);
      setBase64Image(image.data); // Store the base64 representation of the image
    });
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true, // Include this line to get base64 image data
    }).then(image => {
      setSelectedImage(image.path);
      setBase64Image(image.data); // Store the base64 representation of the image
    });
  };

  // Descriptions et conseils pour chaque type d'anomalie
  const anomalyInfo = {
    Acne: {
      description:
        'Acne is a skin condition that occurs when your hair follicles become plugged with oil and dead skin cells, leading to whiteheads, blackheads, or pimples.',
      advice:
        'Keep your face clean, avoid popping pimples, and use non-comedogenic makeup.',
      moreInfoUrl:
        'https://www.google.nl/',
    },
    'Actinic Keratosis': {
      description:
        'Actinic Keratosis is a rough, scaly patch on your skin that develops from years of exposure to the sun, and can sometimes progress to skin cancer.',
      advice:
        'Seek shade, wear sun-protective clothing, and apply sunscreen regularly.',
      moreInfoUrl:
        'https://www.google.nl/',
    },
    'Basal Cell Carcinoma': {
      description:
        'Basal Cell Carcinoma is a type of skin cancer that begins in the basal cells. It often manifests as a slightly transparent bump on the sun-exposed skin.',
      advice:
        'Consult a dermatologist for potential treatment options such as surgical removal or topical treatments.',
      moreInfoUrl:
        'https://www.google.nl/',
    },
    Eczema: {
      description:
        "Eczema, or atopic dermatitis, is a condition that makes your skin red and itchy. It's common in children but can occur at any age.",
      advice:
        'Moisturize regularly, avoid harsh soaps and detergents, and consider using a humidifier in dry weather.',
      moreInfoUrl:
        'https://www.google.nl/',
    },
    Rosacea: {
      description:
        'Rosacea is a common skin condition that causes redness and visible blood vessels in your face. It may also produce small, red, pus-filled bumps.',
      advice:
        'Avoid triggers like hot drinks, spicy foods, and alcohol. Use gentle skin care products and consider medical therapies if symptoms persist.',
      moreInfoUrl:
        'https://www.google.nl/',
    },
  };

  const uploadImage = async () => {
    if (!selectedImage || !base64Image) {
      alert('Please select an image first!');
      return;
    }

    setIsLoading(true); // Activate loading indicator
    try {
      const predictionResponse = await axios.post(
        `${FLASK_API_URL}/predict`,
        {
          image: base64Image, // Use the base64 image directly from the state
        },
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

        // Prepare the form data to send the image file for storage
        const formData = new FormData();
        formData.append('picture', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'upload.jpg',
        });
        formData.append('label', predictionResponse.data.predicted_class);

        // Send the image and label to Node.js server for storage
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
      setIsLoading(false); // Deactivate loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Skin Anomalies</Text>
        <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyButtonText}>View History</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {Object.entries(anomalyInfo).map(([key, value]) => (
          <View key={key} style={styles.infoCard}>
            <Text style={styles.infoTitle}>{key}</Text>
            <Text style={styles.infoText}>{value.description}</Text>
            <Text style={styles.infoText}>{value.advice}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImageFromLibrary}>
          <Text style={styles.buttonText}>Choose Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhotoFromCamera}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
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
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f3f61',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#0f3f61',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FavoriteScreen;
