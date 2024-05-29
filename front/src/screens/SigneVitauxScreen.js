import { View, Text, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import HeartRateComp from '../components/HeartRateComp';
import TempComp from '../components/TempComp';
import { AuthContext } from '../context/AuthContext';
import SpoComp from '../components/SpoComp';
import database from '../utils/firebaseConfig';

const SigneVitauxScreen = () => {
    const { userInfo } = useContext(AuthContext);
    const [hrData, sethrData] = useState(null);
    const [tempData, setTempData] = useState(null);
    const [spoData, setSpoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userEmail = userInfo.user.email;
    const sanitizeEmail = (email) => {
        return email.replace(/[.#$[\]]/g, "_");
    };



    useEffect(() => {
        const fetchUserByEmail = async (email) => {
            const usersRef = database.ref('users');
            const query = usersRef.orderByChild('email').equalTo(email);
            const snapshot = await query.once('value');
            if (snapshot.exists()) {
                const userId = Object.keys(snapshot.val())[0];
                return userId;
            } else {
                throw new Error("User not found");
            }
        };

        const fetchDataFromFirebase = async () => {
            try {
                const userId = await fetchUserByEmail(userEmail);
                if (userId) {
                    const vitalSignsRef = database.ref(`users/${userId}/vitals`);
                    vitalSignsRef.on('value', (snapshot) => {
                        const data = snapshot.val();
                        if (data) {
                            setTempData(data.temp);
                            setSpoData(data.spo2);
                            sethrData(data.heartRate);
                        }
                        setLoading(false);
                    });

                    return () => vitalSignsRef.off(); // Clean up the listener on unmount
                } else {
                    console.error("User ID not found for the provided email.");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching user by email:", error);
                setLoading(false);
            }
        };

        fetchDataFromFirebase();
    }, [userEmail]);
    return (
        <View>
            {loading ? (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
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
            ) : (
                (tempData !== null && spoData !== null && hrData !== null) ? (
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
                            marginVertical: 30,

                        }}>Fréquence cardiaque </Text>
                        <HeartRateComp data={hrData} />
                    </View>
                ) : (
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
                )
            )}
        </View>
    );
};

export default SigneVitauxScreen;
