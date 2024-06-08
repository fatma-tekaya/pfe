import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { colors } from '../styles/colors';

export default function CustomButton({label, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.bleu_bleu,
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '800',
          fontSize: 16,
          color: colors.surface,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}