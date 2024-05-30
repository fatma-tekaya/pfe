const axios = require('axios');
const {db,firestore,firebase } = require('../firebase/index'); // Ensure this is correctly pointing to your Firebase config
const User = require("../models/User");
//const firestore = firebase.firestore();
// Function to send notifications via FCM
const sendNotification = async (userToken, message,userId) => {
    const serverKey = process.env.FCM_SERVER_KEY;
   
    if (!serverKey) {
        console.error('FCM Server Key is not defined');
        return;
    }

    if (userToken) {
        const payload = {
            notification: {
                title: 'Alerte signe vital',
                body: message,
            },
            to: userToken
        };

        try {
            // Send the notification via FCM
            await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `key=${serverKey}`,
                },
            });
            console.log('Notification envoyée avec succès');
            // Save the notification to Firestore
            await firestore.collection('notifications').add({
                userId,
                message,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                seen: false,
            });
            console.log('Notification saved to Firestore');
            
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification:', error);
        }
    } else {
        console.log('Utilisateur sans token FCM, notification non envoyée');
    }
};

// Function to check vital signs for abnormalities
const checkVitalSign = (sign) => {
    const alerts = [];

    if (sign.heartRate > 100) {
        alerts.push(`Fréquence cardiaque élevée détectée à ${sign.heartRate} bpm`);
    }
    if (sign.spo2 < 95) {
        alerts.push(`Niveau de SPO2 bas détecté à ${sign.spo2}%`);
    }
    if (sign.temp > 37.5) {
        alerts.push(`Température élevée détectée à ${sign.temp}°C`);
    }

    return alerts;
};

// Listen for changes in vital signs
const startListening = () => {
    db.ref('users').on('child_changed', async (snapshot) => {
        const userId = snapshot.key;
        const userData = snapshot.val();
        const vitals = userData.vitals;
        const email = userData.email; 
        
        if (vitals) {
            // Get prediction from Flask API
            const prediction = await processPredictions(vitals);


            if (prediction && prediction.length > 0) {
                // Send notification only if an anomaly is detected
                if (prediction[0] === "Abnormal") {

                    const abnormalVitals = checkVitalSign(vitals);
                    const message = `Valeur anormale détectée dans les signes vitaux: ${abnormalVitals.join(', ')}`;
                    // Query MongoDB for the user's FCM token
                    try {
                        const user = await User.findOne({ email });
                        if (user && user.FCMtoken) {
                            await sendNotification(user.FCMtoken, message,userId);
                        } else {
                            console.log('User not found in MongoDB or FCM token is missing');
                        }
                    } catch (error) {
                        console.error('Error querying MongoDB:', error);
                    }
                }
            } else {
                console.log('Prediction failed or returned no result');
            }
        }
    });
    console.log('Listening for vital signs changes...');
};

// Function to process predictions
const processPredictions = async (vitals) => {
    try {
        // Map input vitals to the expected feature names
        const formattedVitals = {
            " HR (BPM)": vitals.heartRate,
            " SpO2 (%)": vitals.spo2,
            "TEMP (*C)": vitals.temp
        };
        const response = await axios.post('http://127.0.0.1:5000/predict', formattedVitals, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.predictions;
    } catch (error) {
        console.error('Error fetching predictions from Flask API:', error);
    }
};

module.exports = {
    startListening,
    sendNotification,
    checkVitalSign
};