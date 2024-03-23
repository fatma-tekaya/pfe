import {  SafeAreaView,
    StyleSheet } from 'react-native'
import React from 'react'
import Navigation from '.'

const AppNav = () => {
  return (
    <SafeAreaView style={styles.root}>
    
      <Navigation/>
   
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    root: {
      flex:1,
      backgroundColor:'#F9FBfC',
      //backgroundColor:'white',
    },
   });
   
export default AppNav