import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { colors } from '../styles/colors';

const TempComp = ({ data }) => {
  const getColorForTemperature = (temp) => {
    if (temp < 35.0) return '#FF6347';  // Red for hypothermia
    if (temp >= 35.0 && temp < 36.5) return '#FFD700'; // Yellow for slightly low
    if (temp > 37.5 && temp <= 38.0) return '#FFD700'; // Yellow for slightly elevated
    if (temp > 38.0) return '#FF6347';  // Red for fever
    return '#3CB371'; // Green for normal
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
            fontSize: 20,
        },
        dashConfig: {
            count: 50,
            width: 4,
        }
    });

    return (
        <View style={styles.container}>
            <CircularProgress
                value={data}
                radius={60}
                maxValue={50}
                activeStrokeColor={getColorForTemperature(data)}
                inActiveStrokeColor="#e0e0e0"
                inActiveStrokeOpacity={0.2}
                dashedStrokeConfig={styles.dashConfig}
                duration={1500}
                title={`°C`} // Affiche la valeur formatée
                titleStyle={{
                    color: getColorForTemperature(data),
                    fontWeight: 'bold',
                    fontSize: 18,
                }}
                progressFormatter={(value) => {
                  'worklet';
                  return value.toFixed(2);
                }}
                progressValueColor={getColorForTemperature(data)}
                progressValueStyle={styles.progressValueStyle}
            />
        </View>
    );
};

export default TempComp;
