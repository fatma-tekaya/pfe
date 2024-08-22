import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { colors } from '../styles/colors';

const ProgressComponent = ({ title, data, maxValue, unit, color }) => {
  return (
    <View style={styles.container}>
      <CircularProgress
        value={data}
        valueSuffix={unit}
        radius={60}
        maxValue={maxValue}
        activeStrokeColor={color}
        activeStrokeSecondaryColor={color}
        inActiveStrokeColor="#e0e0e0"
        inActiveStrokeOpacity={0.2}
        progressValueStyle={styles.progressValueStyle}
        title={title}
        titleStyle={styles.titleStyle}
        duration={1500}
        dashedStrokeConfig={{
          count: 50,
          width: 4,
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
    marginBottom: 10,
  },
  progressValueStyle: {
    fontFamily: 'Outfit-Regular',
    fontSize: 18,
    color: colors.blue_fonce,
  },
  titleStyle: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
    color: colors.blue_fonce,
  }
});

// Exporting three separate components based on this template
export const HeartRateComp = (props) => <ProgressComponent {...props} title="Heart Rate" unit="BPM" maxValue={200} color="#FF6347" />;
export const TempComp = (props) => <ProgressComponent {...props} title="Temperature" unit="°C" maxValue={45} color="#796EFF" />;
export const SpoComp = (props) => <ProgressComponent {...props} title="SPO2" unit="%" maxValue={100} color="#2465FD" />;
