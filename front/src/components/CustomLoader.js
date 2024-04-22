import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

// Custom Loader Component
 const CustomLoader = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0f3f61"  />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background color
    zIndex: 9999, // Higher zIndex to ensure it's displayed over other elements
  },
});
export default CustomLoader;