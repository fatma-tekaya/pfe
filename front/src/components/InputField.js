import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
      }}>
      {icon}
      {inputType == 'password' ? (
        <TextInput
          placeholder={label}
          placeholderTextColor="#333"
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0, color:'black'}}
          secureTextEntry={true}
        />
      ) : (
        <TextInput
          placeholder={label}
          placeholderTextColor="#333"
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0 , color:'black'}}
        />
      )}
      <TouchableOpacity onPress={fieldButtonFunction}>
        <Text style={{color: '#AD40AF', fontWeight: '700'}}>{fieldButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}