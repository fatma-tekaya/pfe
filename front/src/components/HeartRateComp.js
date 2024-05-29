import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

const HeartRateComp = ({ data }) => {
    const maxHeartRate = 200; // Adjust the max heart rate as needed

    return (
        <View style={styles.container}>
            <CircularProgress
                value={data}
                radius={75}
                maxValue={maxHeartRate}
                textColor="#FF6347"
                activeStrokeColor="#FF6347"
                inActiveStrokeColor="#e0e0e0"
                inActiveStrokeOpacity={0.5}
                textStyle={{ fontSize: 30, fontWeight: 'bold' }}
                duration={1000}
                title={'BPM'}
                titleColor="#555"
                titleStyle={{ fontSize: 16 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
});

export default HeartRateComp;
