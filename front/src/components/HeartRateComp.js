import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { colors } from '../styles/colors';

const HeartRateComp = ({ data }) => {
    const maxHeartRate = 200; // Ajustez la fréquence cardiaque maximale selon les besoins

    return (
        <View style={styles.container}>
            <CircularProgress
                value={data}
                radius={60}
                maxValue={maxHeartRate}
                textColor="#FF6347"
                activeStrokeColor="#FF6347"
                inActiveStrokeColor="#e0e0e0"
                inActiveStrokeOpacity={0.2}
                textStyle={styles.textStyle}
                duration={1500}
                title={'BPM'}
                titleStyle={styles.titleStyle}
                progressValueColor="#FF6347"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
    },
    textStyle: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    titleStyle: {
        fontFamily: 'Outfit-Regular',
        fontWeight: '200',
        color: colors.blue_fonce,
        fontSize: 20,
    },
});

export default HeartRateComp;
