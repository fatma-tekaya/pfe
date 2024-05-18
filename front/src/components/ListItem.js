import {View, Image, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { windowWidth } from '../utils/Dimensions';

export default function ListItem({photo, title, subTitle , onPress }) {
  return (
    <View style={{
        flexDirection:'row',
        alignItems:'space-between',
        alignItems:'center',
        marginBottom:22}}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        <Image
          source={photo}
          style={{width: 75, height: 75, borderRadius: 10, marginRight: 8}}
        />
        <View style={{width:windowWidth-220}}>
          <Text
            style={{color: '#333', fontFamily: 'Roboto-Medium', fontSize: 16}}>
            {subTitle}
          </Text>
          <Text
          numberOfLines={1}
            style={{
              color: '#333',
              fontFamily: 'Roboto-Medium',
              fontSize: 12,
              //textTransform: 'uppercase',
            }}>
            {title}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onPress} style={{
        backgroundColor:'#777',
        padding:12,
        width:70,
        borderRadius:10,
      }}>
        <Text style={{
            color:'#fff',
            textAlign:'center',
            fontFamily:'Roboto-Medium',
            fontSize:14,
        }}>
        Details
        </Text>
      </TouchableOpacity>
    </View>
  );
}
