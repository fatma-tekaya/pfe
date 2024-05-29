import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
// Spo Component

const SpoComp = ({ data }) => {

    return (
        <View style={{ marginBottom: 15 }}>

            <CircularProgress
                value={data}
                valueSuffix={'%'}
                radius={80}
                activeStrokeColor={'#2465FD'}
                activeStrokeSecondaryColor={'#C25AFF'}
                dashedStrokeConfig={{
                    count: 50,
                    width: 4,
                }}


            />
        </View>
    );
};

export default SpoComp;