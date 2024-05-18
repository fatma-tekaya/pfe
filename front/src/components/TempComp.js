import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
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
        <View >
            
            <CircularProgress
                value={data}
                radius={120}
                maxValue={45}
                activeStrokeColor={'#796EFF'}
                progressValueStyle={{ fontWeight: '100', color: 'black' }}
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

export default TempComp;