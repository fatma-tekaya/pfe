import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Assurez-vous que le chemin est correct
import { BASE_URL ,FLASK_API_URL} from '../config'; // Assurez-vous que le chemin est correct

const FavoriteScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { userToken , setIsLoading} = useContext(AuthContext);
  const [base64Image, setBase64Image] = useState(null);

  const pickImageFromLibrary = () => {
    ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true  // Include this line to get base64 image data
    }).then(image => {
        setSelectedImage(image.path);
        setBase64Image(image.data);  // Store the base64 representation of the image
    });
};

const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true  // Include this line to get base64 image data
    }).then(image => {
        setSelectedImage(image.path);
        setBase64Image(image.data);  // Store the base64 representation of the image
    });
};


const uploadImage = async () => {
  if (!selectedImage || !base64Image) {
    alert('Please select an image first!');
    return;
  }

  setIsLoading(true); // Activate loading indicator
  try {
    const predictionResponse = await axios.post(`${FLASK_API_URL}/predict`, {
      image: base64Image // Use the base64 image directly from the state
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (predictionResponse.data && predictionResponse.data.predicted_class) {
      alert(`Prediction: ${predictionResponse.data.predicted_class}`);

      // Prepare the form data to send the image file for storage
      const formData = new FormData();
      formData.append('picture', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'upload.jpg'
      });
      formData.append('label', predictionResponse.data.predicted_class);

      // Send the image and label to Node.js server for storage
      const uploadResponse = await axios.put(`${BASE_URL}/upload-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (uploadResponse.data && uploadResponse.data.success) {
        alert('Image and prediction saved successfully!');
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
      <Text style={styles.title}>Analyze Your Skin</Text>
      <Text style={styles.instructions}>Select an image to analyze potential skin diseases.</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImageFromLibrary}>
          <Text style={styles.buttonText}>Choose Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhotoFromCamera}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <View>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.button} onPress={uploadImage}>
            <Text style={styles.buttonText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0f3f61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: 300,
    height: 400,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default FavoriteScreen;
