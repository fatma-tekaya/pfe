import React, { useEffect,useState } from 'react';
import { View ,  Text} from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

// Heart rate Component
const HeartRateComp = ({data}) => {
    return (
        <View style={{ marginBottom: 30 }}>
        
            <LineChart
                data={{
                    labels: data.labels,
                    datasets: [{ data: data.datasets[0].data }]
                   
                }}
                width={Dimensions.get("window").width * 0.9}
                height={220}
                yAxisSuffix=" bpm" 
                chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0, // Pas besoin de décimales pour les battements par minute
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Couleur du texte
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Couleur des étiquettes
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
            
        </View>
    );
};

export default HeartRateComp;