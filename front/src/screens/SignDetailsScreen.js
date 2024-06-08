import React, { useEffect, useState } from 'react';
import { Text, View, Image, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { tipsAndAdvices } from '../model/data'
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
      <ScrollView style={{ height: '93%' }} >
        <Image source={selectedItem.poster[0]}
          style={{ width: 'auto', height: 250 }}
        />
        <View style={styles.textContainer}>
          <Text style={{
            fontFamily: 'Outfit-Medium',
            fontSize: 25,
            color: '#0f3f61'
          }}>{selectedItem.subtitle}</Text>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center'
          }}>
            <Text style={{
              fontFamily: 'Outfit-Light',
              fontSize: 20
            }} >{selectedItem.marge}</Text>
          </View>
        </View>
        {/* horizental line */}
        <View style={{
          marginHorizontal: 15,
          borderWidth: 0.2,
          borderColor: '#5db7ba',
          marginTop: 10,
          marginBottom: 10
        }}></View>
        {/* informations */}
        <View style={styles.textContainer}>
          <Text style={{
            fontFamily: 'Outfit-Medium',
            fontSize: 23
          }}>Informations</Text>
          <Text style={{
            fontFamily: 'Outfit-Regular', color: "gray", lineHeight: 25,
            fontSize: 16
          }} >{selectedItem.details}</Text>
        </View>
        {/* horizental line */}
        <View style={{
          marginHorizontal: 15,
          borderWidth: 0.2,
          borderColor: '#5db7ba',
          marginTop: 10,
          marginBottom: 10
        }}></View>
        {/* conseils */}
        <View style={styles.textContainer}>
          <Text style={{
            fontFamily: 'Outfit-Medium',
            fontSize: 23
          }}>Conseils</Text>
          <Text style={{
            fontFamily: 'Outfit-Regular', color: "gray", lineHeight: 25,
            fontSize: 16
          }} >
            {selectedItem.advices.map((advice, index) => (
              <Text key={index}>

                {"- " + advice}
                {"\n"}
              </Text>
            ))}</Text>
        </View>
        {/* horizental line */}
        <View style={{
          marginHorizontal: 15,
          borderWidth: 0.2,
          borderColor: '#5db7ba',
          marginTop: 10,
          marginBottom: 10
        }}></View>
        {/* photos */}
        <View style={styles.textContainer}>
          <Text style={{
            fontFamily: 'Outfit-Medium',
            fontSize: 23
          }}>Photos</Text>
          <View style={styles.imageContainer}>

            {selectedItem.poster.map((image, index) => (
              index !== 0 &&
              <TouchableOpacity key={index.toString()} onPress={() => openImageModal(image)}>
                <Image
                  source={image}
                  style={{
                    width: '40%',
                    height: '50%',
                    aspectRatio: 1,
                    flex: 1,
                    borderRadius: 15,
                    margin: 7
                  }}
                />
              </TouchableOpacity>
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
        <TouchableOpacity style={styles.btnContainer1}>
          <Text style={{
            textAlign: 'center',
            fontFamily: 'Outfit-Medium',
            color: '#5db7ba',
            fontSize: 18
          }}>Voir Plus</Text>
        </TouchableOpacity>
      </ScrollView >
    </View >

  );
}
const styles = StyleSheet.create({
  backBtnContainer: {
    position: 'absolute',
    zIndex: 10,
    padding: 20
  },
  textContainer: {
    padding: 20,
    display: 'flex',
    gap: 7
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
  //a verifier
  container: {
    flex: 1,
    padding: 10,
  },

  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
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
  },
  modalImage: {
    width: '100%',
    height: '60%',
    aspectRatio: 1,
    borderRadius: 15,
  },
})

export default SignDetailsScreen




