import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { colors } from '../styles/colors';

const HeartRateComp = ({ data }) => {
    const getColorForHeartRate = (rate) => {
        if (rate < 60 || rate > 110) return '#FF6347'; // Red for too low or too high
        if (rate >= 60 && rate <= 70 || rate > 100 && rate <= 110) return '#FFD700'; // Yellow for slightly low or slightly high
        return '#3CB371'; // Green for normal
    };
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop:-15
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
                value={parseFloat(data)} // Utilisé pour la progression du cercle
                radius={60}
                maxValue={150}
                activeStrokeColor={getColorForHeartRate(data)}
                inActiveStrokeColor="#e0e0e0"
                inActiveStrokeOpacity={0.2}
                dashedStrokeConfig={styles.dashConfig}
                duration={1500}
                title={`BPM`} // Affiche la valeur formatée
                titleStyle={{
                    color: getColorForHeartRate(data),
                    fontWeight: 'bold',
                    fontSize: 18,
                }}
                progressFormatter={(value) => {
                    'worklet';
                    return value.toFixed(2);
                  }}
                progressValueColor={getColorForHeartRate(data)}
                progressValueStyle={styles.progressValueStyle}
            />
        </View>
    );
};

export default HeartRateComp;
