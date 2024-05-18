import { View, Text, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';

//import CircularProgressBase from 'react-native-circular-progress-indicator';
import HeartRateComp from '../components/HeartRateComp';
import TempComp from '../components/TempComp';
import { AuthContext } from '../context/AuthContext';

import SpoComp from '../components/SpoComp';
const SigneVitauxScreen = () => {
    const { userInfo } = useContext(AuthContext);
    const [hrData, sethrData] = useState(null);
    const [tempData, setTempData] = useState(null);
    const [spoData, setSpoData] = useState(null);
    const numchanel = userInfo.user.channelInfo.id;
    const apikey = userInfo.user.channelInfo.api_keys[1].api_key;
    useEffect(() => {
       // console.log("signe vitaux de: ");
        const interval = setInterval(() => {
            fetchDataFromThingspeak();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchDataFromThingspeak = async () => {
        try {
            const response = await fetch(`https://api.thingspeak.com/channels/${numchanel}/feeds.json?api_key=${apikey}&results=4`);
            //const response = await fetch('https://api.thingspeak.com/channels/2512930/feeds.json?api_key=ZZFY1AAE8H5AXMA3&results=7');
            const jsonData = await response.json();

            if (jsonData) {
                const labels = jsonData.feeds.map(feed => {
                    const date = new Date(feed.created_at);
                    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                    return time;
                });
                const values = jsonData.feeds.map(feed => parseInt(feed.field2));
                const lastFeedIndex = jsonData.feeds.length - 1; // Récupérer l'index du dernier élément dans feeds
                const lastTemp = parseFloat(jsonData.feeds[lastFeedIndex].field1);
                const lastSpo = parseInt(jsonData.feeds[lastFeedIndex].field3);
                //const temps = jsonData.feeds[length.feeds].field1;
                // data.datasets[0].data.slice(-1)

                sethrData({
                    labels: labels,
                    datasets: [{ data: values }]
                });

                setTempData(lastTemp);
                setSpoData(lastSpo);

            } else {
                console.error('Aucune donnée disponible dans la réponse de l\'API Thingspeak');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données Thingspeak :', error);
        }
    };


    return (
        <View >
            {(tempData && spoData && hrData) ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{
                        alignSelf: 'flex-start',
                        fontFamily: 'Outfit-Medium',
                        fontSize: 25,
                        color: '#0f3f61',
                        marginTop: 10,
                        marginBottom: 30
                    }}>Température</Text>
                    <TempComp data={tempData} />

                    <Text style={{
                        alignSelf: 'flex-start',
                        fontFamily: 'Outfit-Medium',
                        fontSize: 25,
                        color: '#0f3f61',
                        marginVertical: 30
                    }}>Taux d'oxygéne </Text>
                    <SpoComp data={spoData} />


                    <Text style={{
                        alignSelf: 'flex-start',
                        fontFamily: 'Outfit-Medium',
                        fontSize: 25,
                        color: '#0f3f61',
                        marginVertical: 30
                    }}>Fréquence cardiaque </Text>
                    <HeartRateComp data={hrData} />
                </View> :
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    marginTop: '10%'
                }}>
                    <Text style={{
                        alignSelf: 'center',
                        fontFamily: 'Outfit-Regular',
                        fontSize: 20,
                        color: '#0f3f61',

                        marginBottom: 30
                    }}>Recupération des données</Text>
                    <ActivityIndicator size="large" color="#5db7ba" />
                </View>

            }


        </View>
    )


}

export default SigneVitauxScreen;
