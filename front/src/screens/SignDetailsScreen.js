import React, { useEffect, useState } from 'react';
import { Text, View, Image, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { tipsAndAdvices } from '../model/data';

const SignDetailsScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const selectedItem = tipsAndAdvices.find(item => item.id === id);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <View>
      <ScrollView style={{ height: '98%' }}>
        <Image
          source={selectedItem.poster[0]}
          style={{ width: '100%', height: 180 }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>{selectedItem.subtitle}</Text>
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Description</Text>
          <Text style={styles.details}>{selectedItem.details}</Text>
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Symptoms</Text>
          <Text style={styles.details}>
            {selectedItem.advices1.map((advice, index) => (
              <Text key={index}>
                {"- " + advice}
                {"\n"}
              </Text>
            ))}
          </Text>
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Home Remedies</Text>
          <Text style={styles.details}>
            {selectedItem.advices.map((advice, index) => (
              <Text key={index}>
                {"- " + advice}
                {"\n"}
              </Text>
            ))}
          </Text>
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>More</Text>
          <View style={styles.imageContainer}>
            {selectedItem.poster.map((image, index) => (
              index !== 0 && (
                <TouchableOpacity key={index.toString()} onPress={() => openImageModal(image)}>
                  <Image
                    source={image}
                    style={styles.fullImage}
                  />
                </TouchableOpacity>
              )
            ))}
          </View>
          <Modal visible={selectedImage !== null} transparent={true}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Image source={selectedImage} style={styles.modalImage} resizeMode="contain" />
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtnContainer: {
    position: 'absolute',
    zIndex: 10,
    padding: 20
  },
  textContainer: {
    padding: 12,
    display: 'flex',
    gap: 7,
    color: "grey"
  },
  btnContainer1: {
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#5db7ba',
    borderRadius: 99,
    marginHorizontal: 20,
    flex: 1
  },
  btnContainer2: {
    padding: 10,
    backgroundColor: '#5db7ba',
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 99,
    marginEnd: 10,
    flex: 1
  },
  container: {
    flex: 1,
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  fullImage: {
    width: 160, // Fixed width to ensure proper display
    height: 160, // Fixed height to ensure proper display
    borderRadius: 15,
    margin: 5 // Small margin for spacing
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "black"
  },
  modalImage: {
    width: '100%',
    height: '60%',
    borderRadius: 15,
  },
  subtitle: {
    fontFamily: 'Outfit-Medium',
    fontSize: 23,
    color: '#0f3f61',
    color: "grey"
  },
  horizontalLine: {
    marginHorizontal: 10,
    borderWidth: 0.2,
    borderColor: '#5db7ba',
    marginTop: 5,
    marginBottom: 5
  },
  heading: {
    fontFamily: 'Outfit-Medium',
    fontSize: 20,
    color: "grey"
  },
  details: {
    fontFamily: 'Outfit-Regular',
    color: "gray",
    lineHeight: 22,
    fontSize: 15
  },
  btnText: {
    textAlign: 'center',
    fontFamily: 'Outfit-Medium',
    color: '#5db7ba',
    fontSize: 10
  }
});

export default SignDetailsScreen;
