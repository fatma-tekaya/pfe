import { View, Text, ActivityIndicator,StyleSheet } from 'react-native';
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
            const usersRef = database.ref('patients');
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
                    const vitalSignsRef = database.ref(`patients/${userId}/vitals`);
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
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Récupération des données</Text>
                    <ActivityIndicator size="large" color="#5db7ba" />
                </View>
            ) : (
                (tempData !== 0 && spoData !== 0 && hrData !== 0) ? (
                    <View style={styles.dataContainer}>
                        <View style={styles.dataSection}>
                            <Text style={styles.sectionTitle}>Temperature</Text>
                            <TempComp data={tempData} />
                        </View>

                        <View style={styles.dataSection}>
                            <Text style={styles.sectionTitle}>Oxygen rate</Text>
                            <SpoComp data={spoData} />
                        </View>

                        <View style={styles.dataSection}>
                            <Text style={styles.sectionTitle}>Cardiac frequency</Text>
                            <HeartRateComp data={hrData} />
                        </View>
                    </View>
                ) : (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>Connect your watch</Text>
                    </View>
                )
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        alignSelf: 'center',
        fontFamily: 'Outfit-Regular',
        fontSize: 20,
        color: '#0f3f61',
        marginBottom: 30,
    },
    dataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dataSection: {
        alignSelf: 'stretch',
        marginBottom: 30,
    },
    sectionTitle: {
        fontFamily: 'Outfit-Medium',
        fontSize: 25,
        color: '#0f3f61',
        marginBottom: 20,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        alignSelf: 'center',
        fontFamily: 'Outfit-Regular',
        fontSize: 20,
        color: '#0f3f61',
        marginBottom: 30,
    },
});
export default SigneVitauxScreen;
