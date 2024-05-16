import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';

const FavoriteScreen = () => {
  const [prediction, setPrediction] = useState('');
  const [faceBox, setFaceBox] = useState(null);

  const takePicture = async (camera) => {
    if (camera) {
      try {
        const options = { quality: 0.5, base64: true };
        const data = await camera.takePictureAsync(options);

        // Création d'un objet FormData pour envoyer l'image
        const formData = new FormData();
        formData.append('image', {
          uri: data.uri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });

        // Envoi de l'image capturée au serveur Flask
        const response = await axios.post('http://192.168.215.176:8080/predict', formData);
        console.log(response.data);
        setPrediction(response.data.predictions);
      } catch (error) {
        console.error('Error:', error);
        // Gérer l'erreur ici (par exemple, afficher un message d'erreur à l'utilisateur)
      }
    }
  };

  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      const face = faces[0];
      const { bounds } = face;
      setFaceBox({
        width: bounds.size.width,
        height: bounds.size.height,
        x: bounds.origin.x,
        y: bounds.origin.y,
      });
    } else {
      setFaceBox(null);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.front} // Utilisez "back" pour la caméra arrière
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={false}
        onFacesDetected={handleFacesDetected}
        faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
      >
        {faceBox && (
          <View
            style={{
              position: 'absolute',
              borderWidth: 2,
              borderColor: 'red',
              left: faceBox.x,
              top: faceBox.y,
              width: faceBox.width,
              height: faceBox.height,
            }}
          />
        )}
      </RNCamera>
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <Button title="Prendre une photo" onPress={takePicture} />
      </View>
      {prediction ? (
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <Text>Prédiction : {prediction}</Text>
        </View>
      ) : null}

    </View>
  );
};

export default FavoriteScreen;
