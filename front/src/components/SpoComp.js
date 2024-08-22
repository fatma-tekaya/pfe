import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

const SpoComp = ({ data }) => {
    const getColorForSpo2 = (spo2) => {
        if (spo2 >= 95) return '#3CB371'; // Green for normal
        if (spo2 >= 90) return '#FFD700'; // Yellow for caution (mildly low)
        return '#FF6347'; // Red for critical (very low)
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
            color: getColorForSpo2(data),
            fontSize: 20,
        },
        titleStyle: {
            fontWeight: 'bold',
            color: '#000',
            fontSize: 18,
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
                valueSuffix={'%'}
                radius={60}
                maxValue={150} // Adjusted to reflect the maximum percentage for SpO2
                progressValueStyle={styles.progressValueStyle}
                activeStrokeColor={styles.progressValueStyle.color}
                activeStrokeSecondaryColor={styles.progressValueStyle.color}
                dashedStrokeConfig={styles.dashConfig}
                inActiveStrokeColor="#e0e0e0"
                inActiveStrokeOpacity={0.2}
                duration={1500}
                title={'SPO2'}
                titleStyle={{
                    color: getColorForSpo2(data),
                    fontWeight: 'bold',
                    fontSize: 18,
                }}
                titleColor={'#000'}
             
                progressValueColor={styles.progressValueStyle.color}
            />
        </View>
    );
};

export default SpoComp;
