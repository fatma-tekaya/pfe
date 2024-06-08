import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { colors } from '../styles/colors';

const SpoComp = ({ data }) => {
    return (
        <View style={styles.container}>
            <CircularProgress
                value={data}
                valueSuffix={'%'}
                radius={80}
                progressValueStyle={styles.progressValueStyle}
                activeStrokeColor={'#2465FD'}
                activeStrokeSecondaryColor={'#C25AFF'}
                dashedStrokeConfig={{
                    count: 50,
                    width: 4,
                }}
                inActiveStrokeColor="#e0e0e0"
                inActiveStrokeOpacity={0.2}
                duration={1500}
                title={'SPO2'}
                titleColor={'#000'}
                titleStyle={{ fontWeight: 'bold' }}
                progressValueColor={'#000'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
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

export default SpoComp;
