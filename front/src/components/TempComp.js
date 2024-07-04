import React, { useEffect, useState  } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { colors } from '../styles/colors';
// temp Component
const TempComp = ({ data }) => {
    const getColorForTemperature = (temp) => {
        if (temp <= 36) {
            return "blue";
        }
        else if (temp > 36 && temp <= 37.5) {
            return "green";
        } else {
            return "red";
        }
    };
    return (
        <View style={styles.container}>
          <CircularProgress
            value={data}
            radius={60}
            maxValue={45}
            valueSuffix={'°'}
            activeStrokeColor={'#796EFF'}
            progressValueStyle={styles.progressValueStyle}
            activeStrokeSecondaryColor={getColorForTemperature(data)}
            inActiveStrokeColor="black"
            duration={5000}
            dashedStrokeConfig={{
              count: 50,
              width: 4,
            }}
            progressFormatter={(value) => {
              'worklet';
              return value.toFixed(2);
            }}
          />
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      progressValueStyle: {
        fontFamily: 'Outfit-Regular',
        fontWeight: '200',
        color: colors.blue_fonce,
        fontSize: 30,
      },
    });
    

export default TempComp;