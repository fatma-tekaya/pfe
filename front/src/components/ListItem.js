import {View, Image, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { windowWidth } from '../utils/Dimensions';

export default function ListItem({photo, title, subTitle, isFree , price, onPress }) {
  return (
    <View style={{
        flexDirection:'row',
        alignItems:'space-between',
        alignItems:'center',
        marginBottom:22}}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        <Image
          source={photo}
          style={{width: 55, height: 55, borderRadius: 10, marginRight: 8}}
        />
        <View style={{width:windowWidth-220}}>
          <Text
            style={{color: '#333', fontFamily: 'Roboto-Medium', fontSize: 14}}>
            {subTitle}
          </Text>
          <Text
          numberOfLines={1}
            style={{
              color: '#333',
              fontFamily: 'Roboto-Medium',
              fontSize: 14,
              textTransform: 'uppercase',
            }}>
            {title}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onPress} style={{
        backgroundColor:'#0aada8',
        padding:10,
        width:100,
        borderRadius:10,
      }}>
        <Text style={{
            color:'#fff',
            textAlign:'center',
            fontFamily:'Roboto-Medium',
            fontSize:14,
        }}>
            {isFree == 'Yes' && 'Pay'}
            {isFree == 'No' && price}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
